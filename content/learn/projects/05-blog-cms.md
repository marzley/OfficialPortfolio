---
slug: blog-cms
title: "Project 4: Blog with an admin panel (PHP, MySQL, login, CRUD)"
after: data-analysis-report
---
# Project 4: Blog with an admin panel (PHP, MySQL, login, CRUD)

A blog is the classic first database project because it has everything real web apps have: public pages, an admin login, creating/reading/updating/deleting records (**CRUD**), forms, images, friendly URLs and security. Once you can build a blog, you can build most content sites: a church news page, a school notice board, a company "news and updates" section.

**You'll practise:** PHP, MySQL with PDO, password hashing, sessions, CSRF protection, escaping output, slugs, pagination and file uploads.

**Lessons you need:** [forms and security](./?track=php&lesson=forms-security), [MySQL with PDO](./?track=php&lesson=mysql-pdo), [the CRUD app](./?track=php&lesson=crud-app), [sessions and login](./?track=php&lesson=sessions-login), [file uploads](./?track=php&lesson=file-uploads), [keys and design](./?track=sql&lesson=keys-design).

## Step 1: Features (MoSCoW)

| Priority | Feature |
|---|---|
| Must | Public list of published posts, newest first, with pagination |
| Must | Single post page at a friendly URL: `/post.php?slug=how-to-register-kra-pin` |
| Must | Admin login (one or more admin users) |
| Must | Admin: create, edit, delete, publish/unpublish posts |
| Should | Categories; a cover image per post |
| Should | Search |
| Could | Comments with moderation; RSS feed; view counter |

## Step 2: Database design

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  category_id INT NULL,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  excerpt VARCHAR(300) NOT NULL DEFAULT '',
  body MEDIUMTEXT NOT NULL,
  cover VARCHAR(255) NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX (status, published_at)
);
```

Why these choices:
- `slug UNIQUE`: no two posts can share a URL.
- `ON DELETE SET NULL`: deleting a category doesn't delete its posts.
- The index on `(status, published_at)` makes "latest published posts" fast even with thousands of posts.

## Step 3: Folder structure

```text
blog/
├── config.php          (database password: in .gitignore)
├── config.example.php
├── db.php              (PDO connection + helper functions)
├── index.php           (public post list)
├── post.php            (single post)
├── uploads/            (cover images: in .gitignore)
└── admin/
    ├── login.php
    ├── logout.php
    ├── index.php       (list of all posts)
    ├── edit.php        (create + edit)
    └── delete.php
```

## Step 4: Connection and helpers

```php
<?php
// db.php
$config = require __DIR__ . '/config.php';   // returns ['dsn' => ..., 'user' => ..., 'pass' => ...]
$pdo = new PDO($config['dsn'], $config['user'], $config['pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
session_start();

function e(?string $s): string { return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }

function csrf_token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function check_csrf(): void {
    if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) { http_response_code(400); exit('Invalid form. Please go back and try again.'); }
}
function require_login(): void {
    if (empty($_SESSION['user_id'])) { header('Location: login.php'); exit; }
}
```

Three security habits are already here: **prepared statements** (coming next) against SQL injection, `e()` against XSS whenever you print user content, and **CSRF tokens** on every form that changes data.

## Step 5: Slugs (friendly URLs)

A slug turns "How to Register a KRA PIN (2026)" into `how-to-register-a-kra-pin-2026`. Try it:

```try-php
<?php
function slugify(string $title): string {
    $s = strtolower(trim($title));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);   // anything that isn't a letter or digit becomes -
    return trim($s, '-') ?: 'post';
}

function uniqueSlug(string $title, array $taken): string {
    $base = slugify($title);
    $slug = $base;
    $n = 2;
    while (in_array($slug, $taken, true)) {
        $slug = $base . '-' . $n++;
    }
    return $slug;
}

echo slugify("How to Register a KRA PIN (2026)"), "\n";
echo slugify("  Unga prices: what's next?  "), "\n";
$taken = ['ajira-digital-guide', 'ajira-digital-guide-2'];
echo uniqueSlug("Ajira Digital guide", $taken), "\n";
```

Put both functions in `db.php` so every page can use them. In the real app, `$taken` comes from `SELECT slug FROM posts WHERE slug LIKE ?`, and the `UNIQUE` key is the final safety net.

## Step 6: Admin login

Create the first admin with a one-off script (then delete it), so the password is hashed:

```php
<?php
// make-admin.php: run once from the command line: php make-admin.php, then delete this file
require 'db.php';
$stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
$stmt->execute(['Admin', 'admin@example.com', password_hash('choose-a-long-password', PASSWORD_DEFAULT)]);
echo "Admin created\n";
```

The login page:

```php
<?php
// admin/login.php
require __DIR__ . '/../db.php';
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE email = ?');
    $stmt->execute([trim($_POST['email'] ?? '')]);
    $user = $stmt->fetch();
    if ($user && password_verify($_POST['password'] ?? '', $user['password_hash'])) {
        session_regenerate_id(true);          // stops session fixation attacks
        $_SESSION['user_id'] = $user['id'];
        header('Location: index.php');
        exit;
    }
    $error = 'Wrong email or password.';      // same message for both: don't reveal which emails exist
}
?>
<form method="post">
  <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
  <label>Email <input type="email" name="email" required></label>
  <label>Password <input type="password" name="password" required></label>
  <button>Log in</button>
  <p><?= e($error) ?></p>
</form>
```

Add login rate limiting later (e.g. lock for 15 minutes after 5 failures from the same IP) so passwords can't be guessed by bots.

## Step 7: Create and edit posts

One page handles both: if there's an `id`, load the post and `UPDATE`; otherwise `INSERT`.

```php
<?php
// admin/edit.php (core logic)
require __DIR__ . '/../db.php';
require_login();
$id = (int)($_GET['id'] ?? 0);
$post = ['title' => '', 'body' => '', 'excerpt' => '', 'status' => 'draft', 'category_id' => null];
if ($id) {
    $stmt = $pdo->prepare('SELECT * FROM posts WHERE id = ?');
    $stmt->execute([$id]);
    $post = $stmt->fetch() ?: exit('Post not found');
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_csrf();
    $title = trim($_POST['title'] ?? '');
    $body = trim($_POST['body'] ?? '');
    $status = ($_POST['status'] ?? '') === 'published' ? 'published' : 'draft';   // never trust the value: whitelist it
    if ($title === '' || $body === '') {
        $error = 'Title and body are required.';
    } elseif ($id) {
        $pdo->prepare('UPDATE posts SET title = ?, body = ?, excerpt = ?, status = ?,
                       published_at = IF(? = "published" AND published_at IS NULL, NOW(), published_at) WHERE id = ?')
            ->execute([$title, $body, mb_substr(trim($_POST['excerpt'] ?? ''), 0, 300), $status, $status, $id]);
    } else {
        $taken = $pdo->query('SELECT slug FROM posts')->fetchAll(PDO::FETCH_COLUMN);
        $pdo->prepare('INSERT INTO posts (author_id, title, slug, excerpt, body, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
            ->execute([$_SESSION['user_id'], $title, uniqueSlug($title, $taken), mb_substr(trim($_POST['excerpt'] ?? ''), 0, 300),
                       $body, $status, $status === 'published' ? date('Y-m-d H:i:s') : null]);
        $id = (int)$pdo->lastInsertId();
    }
    if (empty($error)) { header('Location: index.php?saved=' . $id); exit; }
}
```

**Delete** must be a POST form with a CSRF token and a confirmation, never a plain link like `delete.php?id=5`. Links can be triggered by crawlers, prefetching or a malicious page.

## Step 8: Public pages and pagination

```php
<?php
// index.php
require 'db.php';
$perPage = 10;
$page = max(1, (int)($_GET['page'] ?? 1));
$total = (int)$pdo->query("SELECT COUNT(*) FROM posts WHERE status = 'published'")->fetchColumn();
$stmt = $pdo->prepare("SELECT title, slug, excerpt, published_at FROM posts
                       WHERE status = 'published' ORDER BY published_at DESC LIMIT ? OFFSET ?");
$stmt->bindValue(1, $perPage, PDO::PARAM_INT);
$stmt->bindValue(2, ($page - 1) * $perPage, PDO::PARAM_INT);
$stmt->execute();
foreach ($stmt as $p) {
    echo '<article><h2><a href="post.php?slug=' . urlencode($p['slug']) . '">' . e($p['title']) . '</a></h2>';
    echo '<p>' . e($p['excerpt']) . '</p><small>' . e(date('j M Y', strtotime($p['published_at']))) . '</small></article>';
}
$pages = (int)ceil($total / $perPage);
if ($page < $pages) echo '<a href="?page=' . ($page + 1) . '">Older posts →</a>';
```

`post.php` loads one post with `WHERE slug = ? AND status = 'published'` and returns a proper **404** if it isn't found (`http_response_code(404)`). Drafts must never be visible to the public.

For the post body, the safest beginner approach is to store **plain text or Markdown** and convert it on display, rather than allowing raw HTML from the editor. If you allow HTML, you must sanitise it with a library such as HTML Purifier.

## Step 9: Cover images (safely)

Follow [file uploads](./?track=php&lesson=file-uploads): check the upload error code and size (e.g. under 2 MB), verify it's really an image with `finfo` (not just the file extension), give it a random new name (`bin2hex(random_bytes(16)) . '.webp'`), and store only the file name in the database. Make sure the uploads folder can't run PHP files.

## Step 10: SEO

Each post page gets its own `<title>`, meta description (the excerpt), an `og:image` (the cover), and `Article` structured data. Generate `sitemap.xml` from the posts table. See [SEO basics](./?track=marketing&lesson=seo-basics).

## Step 11: Deploy

Create the database in cPanel, import the SQL, upload the files, set `config.php` on the server only, and turn on HTTPS ([cPanel deployment](./?track=hosting&lesson=cpanel-deploy), [PHP deployment](./?track=php&lesson=deploy-php-hosting)). Set `display_errors = Off` in production so visitors never see error messages with file paths.

## Security checklist

- Every query uses prepared statements, with no user input glued into SQL
- Every user-supplied value printed with `e()`
- Every form that changes data has a CSRF token; deletes are POST
- Passwords hashed with `password_hash`, checked with `password_verify`
- `session_regenerate_id(true)` after login; admin pages call `require_login()`
- Uploads checked by real file type, renamed, size-limited
- `config.php` and `uploads/` are not in Git

## Stretch goals

- Comments with moderation (status pending/approved) and a honeypot.
- Categories and tags pages; search with `LIKE` or MySQL `FULLTEXT`.
- An RSS feed (`feed.xml`).
- Roles: *editor* can write, only *admin* can publish.
- Rewrite it in Laravel, then compare ([Composer and frameworks](./?track=php&lesson=composer-frameworks)).

```quiz
Q: What does CRUD stand for? (four words)
A: Create Read Update Delete | create, read, update, delete
Q: Which PHP function checks a password against its stored hash?
A: password_verify | password_verify()
Q: Which PHP function escapes text before printing it in HTML?
A: htmlspecialchars | htmlspecialchars()
Q: Should a delete action be a GET link or a POST form?
A: POST | a POST form | POST form
Q: What do we call the URL-friendly version of a title, like how-to-register-a-kra-pin?
A: slug | a slug
```
