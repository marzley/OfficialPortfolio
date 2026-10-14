<?php
declare(strict_types=1);
require __DIR__ . '/harness.php';
foreach (glob(__DIR__ . '/*Test.php') as $f) require $f;
exit(runTests($argv[1] ?? null));
