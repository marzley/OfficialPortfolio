<?php
// Public certificate check: /portal/verify.php?code=MTC-XXXXX-XXXXX
define('MARZLEY_PORTAL', true);
require __DIR__ . '/lib.php';

header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex');
$e = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
$code = strtoupper(trim((string)($_GET['code'] ?? '')));
$cert = null;
if (preg_match('/^MTC-[A-Z0-9]{5}-[A-Z0-9]{5}$/', $code)) {
    $cert = q('SELECT c.code, c.issued_at, cl.name, co.title FROM certificates c JOIN clients cl ON cl.id = c.client_id JOIN courses co ON co.id = c.course_id WHERE c.code = ?', [$code])->fetch() ?: null;
}
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Certificate check | Marzley Tech Solutions</title>
    <meta name="robots" content="noindex" />
    <link rel="icon" type="image/png" sizes="32x32" href="../img/brand/favicon-32.png" />
    <link rel="stylesheet" href="../css/home.css" />
    <link rel="stylesheet" href="portal.css" />
</head>
<body class="portal-body">
    <main class="wrap portal-main">
        <section class="portal-signin verify">
            <img src="../img/brand/logo-256.webp" alt="" width="96" height="96" />
            <h1>Certificate check</h1>
            <?php if ($cert): ?>
                <p class="verify-ok">✓ This certificate is genuine.</p>
                <dl class="verify-list">
                    <dt>Awarded to</dt><dd><?= $e($cert['name']) ?></dd>
                    <dt>Course</dt><dd><?= $e($cert['title']) ?></dd>
                    <dt>Date</dt><dd><?= $e(date('j F Y', strtotime($cert['issued_at']))) ?></dd>
                    <dt>Code</dt><dd><?= $e($cert['code']) ?></dd>
                </dl>
            <?php else: ?>
                <?php if ($code !== ''): ?><p class="portal-error">No certificate was found with code <?= $e($code) ?>.</p><?php endif; ?>
                <form method="get" class="verify-form">
                    <label for="code">Certificate code</label>
                    <input id="code" name="code" value="<?= $e($code) ?>" placeholder="MTC-XXXXX-XXXXX" required />
                    <button type="submit" class="btn btn-solid">Check</button>
                </form>
            <?php endif; ?>
            <p class="portal-help">Issued by <a href="../">Marzley Tech Solutions</a>, Kenya.</p>
        </section>
    </main>
</body>
</html>
