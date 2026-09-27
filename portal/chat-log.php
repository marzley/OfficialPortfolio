<?php
// The website chat couldn't answer a question: keep the question (never names, numbers or emails)
// so the team can add an answer to data/knowledge.json. Shown in the portal under Growth.
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
$cfg = array_filter([getenv('PORTAL_CONFIG') ?: ($_SERVER['PORTAL_CONFIG'] ?? null), dirname(__DIR__, 2) . '/portal-config.php', dirname(__DIR__) . '/portal-config.php'], 'is_readable');
if (!$cfg) { http_response_code(204); exit; }
require __DIR__ . '/lib.php';
if (!rate_ok('chatlog', 30, 3600)) { http_response_code(429); exit; }
$q = (string)(json_decode((string)file_get_contents('php://input'), true)['q'] ?? '');
// Remove anything personal before saving
$q = preg_replace(['/[\w.+-]+@[\w-]+\.[\w.]+/u', '/\+?\d[\d\s-]{6,}\d/', '/\s+/u'], ['[email]', '[number]', ' '], $q);
$q = mb_substr(trim($q), 0, 300);
if (mb_strlen($q) < 3) { http_response_code(204); exit; }
try {
    $row = q('SELECT id FROM chat_questions WHERE LOWER(question) = LOWER(?)', [$q])->fetch();
    if ($row) q('UPDATE chat_questions SET times = times + 1, last_at = ? WHERE id = ?', [now(), $row['id']]);
    else q('INSERT INTO chat_questions (question, times, first_at, last_at) VALUES (?, 1, ?, ?)', [$q, now(), now()]);
} catch (Throwable $e) {
    error_log('chat log: ' . $e->getMessage());
}
http_response_code(204);
