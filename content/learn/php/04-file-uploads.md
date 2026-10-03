---
slug: file-uploads
title: Secure file uploads (images and documents)
after: sessions-login
---
# Secure file uploads

Profile photos, ID scans, assignment PDFs, product images: many systems accept uploads. Uploads are also one of the **most dangerous** features: a careless upload form lets an attacker put a PHP file on your server and take it over. Here's how to do it safely.

## The form

```html
<form method="post" action="upload.php" enctype="multipart/form-data">
  <label>Product photo <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required></label>
  <button>Upload</button>
</form>
```

`enctype="multipart/form-data"` is **required** for file uploads; without it the file never arrives.

## What PHP gives you: $_FILES

```php
$_FILES['photo'] = [
  'name'     => 'my photo.JPG',       // from the user: NEVER trust it
  'type'     => 'image/jpeg',         // from the browser: NEVER trust it
  'tmp_name' => '/tmp/phpA1b2C3',     // where PHP stored it temporarily
  'error'    => 0,                    // UPLOAD_ERR_OK
  'size'     => 482193,               // bytes
];
```

## The secure upload script

```php
<?php
const MAX_BYTES = 3 * 1024 * 1024;                        // 3 MB
const ALLOWED = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$dir = dirname(__DIR__) . '/uploads';                     // OUTSIDE public_html if possible

$f = $_FILES['photo'] ?? null;
if (!$f || $f['error'] !== UPLOAD_ERR_OK) {
    exit('Upload failed. Please try again.');
}
if ($f['size'] > MAX_BYTES) {
    exit('File too big. Maximum is 3 MB.');
}

// 1. Check the REAL type from the file's contents, not the name or browser
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
if (!isset(ALLOWED[$mime])) {
    exit('Only JPG, PNG or WebP images are allowed.');
}

// 2. For images, confirm it really is an image
if (!getimagesize($f['tmp_name'])) {
    exit('That file is not a valid image.');
}

// 3. Make our own random name with the correct extension
$name = bin2hex(random_bytes(16)) . '.' . ALLOWED[$mime];

// 4. Move it from the temp folder into place
if (!move_uploaded_file($f['tmp_name'], "$dir/$name")) {
    exit('Could not save the file.');
}

// 5. Save only the new name in the database
$stmt = $pdo->prepare('UPDATE products SET photo = ? WHERE id = ?');
$stmt->execute([$name, $productId]);
echo 'Uploaded!';
```

## Why each step matters

| Step | Stops |
|---|---|
| Size limit | Filling your disk, slow uploads |
| Check contents with `finfo` | `shell.php` renamed to `photo.jpg` |
| `getimagesize` | Files pretending to be images |
| Random new name | Overwriting other files, `../../` tricks, guessing names, strange characters |
| Our own extension | Double extensions like `photo.php.jpg` |
| Store outside `public_html` | Uploaded files being run as code |

## Block PHP in the uploads folder

If uploads must be inside the web folder, add an `.htaccess` there (Apache):

```
# uploads/.htaccess
php_flag engine off
<FilesMatch "\.(php|phtml|phar|pl|py|cgi)$">
    Require all denied
</FilesMatch>
Options -Indexes
```

## Serving private files (e.g. ID documents)

Store them outside `public_html` and send them through a PHP script that checks the user is allowed:

```php
<?php
session_start();
if (empty($_SESSION['user_id'])) { http_response_code(403); exit; }
$name = basename($_GET['f'] ?? '');                 // basename blocks ../ paths
$path = dirname(__DIR__) . "/private-uploads/$name";
if (!preg_match('/^[a-f0-9]{32}\.(pdf|jpg|png)$/', $name) || !is_file($path)) { http_response_code(404); exit; }
// also check that this file belongs to this user in the database!
header('Content-Type: ' . mime_content_type($path));
header('Content-Disposition: inline; filename="document"');
readfile($path);
```

## Server limits (php.ini)

| Setting | Controls |
|---|---|
| `upload_max_filesize` | Largest single file |
| `post_max_size` | Largest whole form (must be bigger) |
| `max_file_uploads` | Files per request |

On cPanel, change them under **Select PHP Version → Options** or **MultiPHP INI Editor**.

## Resize images to save space

Phone photos are 3–5 MB. Resize on upload (GD or Imagick) to around 1200 px wide and save as WebP: pages load faster and hosting lasts longer.

## Where file uploads appear (and why they're risky)

Job portals collect CVs, schools collect birth certificates and passport photos, SACCOs collect ID copies, e-commerce sites upload product images, and support systems accept screenshots. Uploads are also one of the most common ways websites get hacked: if an attacker can upload a `.php` file and then visit it, they can run code on your server. Handling uploads correctly protects both your server and your users' personal documents.

## Validating uploads: a reusable function

```try-php
<?php
// Simulated $_FILES entry so the logic can run here
$file = ['name' => 'My CV (final).pdf', 'size' => 245_000, 'error' => UPLOAD_ERR_OK, 'tmp_name' => '/tmp/php123'];

function uploadErrorMessage(int $code): string {
    return match ($code) {
        UPLOAD_ERR_OK => 'OK',
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'File is too large',
        UPLOAD_ERR_PARTIAL => 'Upload was interrupted, please try again',
        UPLOAD_ERR_NO_FILE => 'Please choose a file',
        default => 'Upload failed, please try again',
    };
}

function safeFileName(string $original, string $ext): string {
    $base = pathinfo($original, PATHINFO_FILENAME);
    $base = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $base));
    $base = trim($base, '-') ?: 'file';
    return substr($base, 0, 40) . '-' . bin2hex(random_bytes(6)) . '.' . $ext;
}

$maxBytes = 2 * 1024 * 1024;
$allowedExt = ['pdf', 'jpg', 'jpeg', 'png'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if ($file['error'] !== UPLOAD_ERR_OK) {
    echo uploadErrorMessage($file['error']), "\n";
} elseif ($file['size'] > $maxBytes) {
    echo "File must be 2 MB or smaller\n";
} elseif (!in_array($ext, $allowedExt, true)) {
    echo "Only PDF, JPG and PNG files are allowed\n";
} else {
    $stored = safeFileName($file['name'], $ext);
    echo "Accepted. Would be saved as: ", preg_replace('/-[0-9a-f]{12}\./', '-XXXXXXXXXXXX.', $stored), "\n";
}
```

The stored name is generated by the server (random part included), so users can't overwrite each other's files or choose dangerous names. In a real script, also confirm the **real content type** with `finfo` (shown earlier in this lesson) and move the file with `move_uploaded_file()`.

## Checking image files properly

```php
$info = getimagesize($_FILES['photo']['tmp_name']);
if ($info === false) {
    exit('Not a valid image');
}
[$width, $height] = $info;
if ($width > 6000 || $height > 6000) {
    exit('Image dimensions are too large');
}
$allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
if (!in_array($info['mime'], $allowedMime, true)) {
    exit('Only JPG, PNG or WebP images');
}
```

Re-encoding images (loading them with GD or Imagick and saving a new copy) also strips hidden data and many malicious payloads, and lets you resize them.

## Resizing an uploaded photo with GD

```php
function resizeToJpeg(string $src, string $dest, int $maxWidth = 1200): bool {
    $img = imagecreatefromstring(file_get_contents($src));
    if (!$img) return false;
    $w = imagesx($img);
    $h = imagesy($img);
    if ($w > $maxWidth) {
        $newH = (int) round($h * $maxWidth / $w);
        $resized = imagescale($img, $maxWidth, $newH);
        imagedestroy($img);
        $img = $resized;
    }
    $ok = imagejpeg($img, $dest, 82);   // quality 82: good balance of size and quality
    imagedestroy($img);
    return $ok;
}
```

A 5 MB phone photo can become a 200 KB image, saving storage and making pages much faster.

## Storing upload records in the database

```sql
CREATE TABLE uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(100) NOT NULL UNIQUE,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

```php
$stmt = $pdo->prepare('INSERT INTO uploads (user_id, original_name, stored_name, mime_type, size_bytes) VALUES (?, ?, ?, ?, ?)');
$stmt->execute([$userId, $file['name'], $stored, $mime, $file['size']]);
```

Keep the original name only for display (escaped with `htmlspecialchars`), never as the path on disk.

## Multiple files in one form

```html
<input type="file" name="documents[]" multiple accept=".pdf,.jpg,.png">
```

```php
foreach ($_FILES['documents']['name'] as $i => $name) {
    $file = [
        'name' => $name,
        'tmp_name' => $_FILES['documents']['tmp_name'][$i],
        'size' => $_FILES['documents']['size'][$i],
        'error' => $_FILES['documents']['error'][$i],
    ];
    // validate and save each $file with the same function as a single upload
}
```

PHP arranges multiple files "sideways" (all names in one array, all sizes in another), so rebuilding one array per file keeps your validation code simple.

## Privacy and data protection

ID copies, CVs, medical documents and certificates are personal data under Kenya's Data Protection Act:

- Store them outside `public_html` and serve them only to authorised users through a PHP script that checks permissions.
- Use HTTPS for uploads and downloads.
- Delete files you no longer need (e.g. applications after the recruitment period, according to a retention policy).
- Limit who can access the folder on the server; include these files in encrypted backups.

## Security checklist

1. Check `$_FILES['x']['error']` first.
2. Enforce a size limit in PHP (and in `php.ini`: `upload_max_filesize`, `post_max_size`).
3. Allow-list extensions and verify the real MIME type with `finfo` (and `getimagesize` for images).
4. Generate a new random file name; never use the user's name as the path.
5. Store outside the web root, or block script execution in the uploads folder.
6. Use `move_uploaded_file()`.
7. Serve private files through a permission-checking script with correct headers.
8. Consider re-encoding images and scanning files with antivirus (ClamAV) on servers handling many uploads.

## Practice

1. Turn the validation logic above into a function `validateUpload(array $file, array $allowed, int $max): ?string` that returns an error message or null.
2. Build an upload form for a passport photo that only accepts JPG/PNG under 1 MB and resizes to 600px wide.
3. Store upload records in a database table and list each user's files.
4. Create `download.php?id=...` that checks the logged-in user owns the file before sending it.
5. Handle a multiple-file upload of up to 3 PDF documents.

:::think An upload form checks that the file name ends in ".jpg". An attacker uploads "shell.php.jpg" and also "photo.jpg" that actually contains PHP code. What protections stop these attacks?
Generate your own random file name with an extension chosen from the verified type (so the user's name never matters), verify the real content with finfo/getimagesize and re-encode images, store uploads outside the web root or block PHP execution in the uploads folder, and serve files through a script. Extension checks alone are easy to bypass.
:::

```quiz
Q: Which form attribute is required for file uploads? Write enctype's value.
A: multipart/form-data
Q: Which PHP function moves the uploaded file from the temp folder?
A: move_uploaded_file | move_uploaded_file()
Q: Should you trust the file name and type sent by the browser? (yes or no)
A: no
Q: Which PHP class reads a file's real type from its contents?
A: finfo
Q: Which function strips folder paths like ../ from a file name?
A: basename | basename()
Q: Which PHP function returns an image's width, height and MIME type, failing for non-images?
A: getimagesize
Q: Which php.ini setting limits the size of a single uploaded file?
A: upload_max_filesize
Q: Which PHP function generates secure random bytes for file names?
A: random_bytes
```
