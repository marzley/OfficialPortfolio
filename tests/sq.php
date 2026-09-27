<?php
// Test helper: php tests/sq.php DB exec|sel "SQL"
$p = new PDO('sqlite:' . $argv[1]);
$p->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
if ($argv[2] === 'exec') $p->exec($argv[3]);
else echo json_encode($p->query($argv[3])->fetchAll(PDO::FETCH_ASSOC));
