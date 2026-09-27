<?php
// Client reviews the team chose to show on the website (clients ticked "you may show my comment").
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=600');
$cfg = array_filter([getenv('PORTAL_CONFIG') ?: ($_SERVER['PORTAL_CONFIG'] ?? null), dirname(__DIR__, 2) . '/portal-config.php', dirname(__DIR__) . '/portal-config.php'], 'is_readable');
if (!$cfg) { echo '{"reviews":[]}'; exit; }
require __DIR__ . '/lib.php';
try {
    $rows = q('SELECT c.name, p.title, f.rating, f.comment, f.submitted_at FROM feedback f JOIN clients c ON c.id = f.client_id JOIN projects p ON p.id = f.project_id
        WHERE f.published = 1 AND f.publish_ok = 1 AND f.rating >= 4 ORDER BY f.submitted_at DESC LIMIT 12')->fetchAll();
} catch (Throwable $e) {
    $rows = [];
}
echo json_encode(['reviews' => array_map(fn($r) => ['name' => $r['name'], 'project' => $r['title'], 'rating' => (int)$r['rating'],
    'comment' => $r['comment'], 'date' => substr((string)$r['submitted_at'], 0, 10)], $rows)], JSON_UNESCAPED_UNICODE);
