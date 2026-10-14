<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="csrf" content="<?= e(\Akiba\Core\Session::csrf()) ?>">
<title><?= e($title ?? 'AkibaFlow') ?> · AkibaFlow</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/app.css">
</head>
<body>
<?= $content ?>
<script src="/assets/js/app.js" defer></script>
</body>
</html>
