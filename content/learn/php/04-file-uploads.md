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
```
