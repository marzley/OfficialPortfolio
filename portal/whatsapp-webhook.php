<?php
// WhatsApp replies: Meta calls this when someone replies to one of our WhatsApp messages.
// Each reply is emailed to the team with a link to answer it on WhatsApp.
// Set up in Meta for Developers > your app > WhatsApp > Configuration (see GO-LIVE.md, WhatsApp):
//   Callback URL: https://marzleytechsolutions.co.ke/portal/whatsapp-webhook.php
//   Verify token: the 'verify_token' in portal-config.php > whatsapp. Subscribe to "messages".
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
header('Cache-Control: no-store');
$cfg = array_filter([getenv('PORTAL_CONFIG') ?: ($_SERVER['PORTAL_CONFIG'] ?? null), dirname(__DIR__, 2) . '/portal-config.php', dirname(__DIR__) . '/portal-config.php'], 'is_readable');
if (!$cfg) { http_response_code(404); exit; }
require __DIR__ . '/lib.php';
$w = config()['whatsapp'] ?? [];

// 1. Meta checks the URL once when you save it
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $ok = ($_GET['hub_mode'] ?? '') === 'subscribe' && !empty($w['verify_token']) && hash_equals((string)$w['verify_token'], (string)($_GET['hub_verify_token'] ?? ''));
    http_response_code($ok ? 200 : 403);
    header('Content-Type: text/plain');
    echo $ok ? (string)($_GET['hub_challenge'] ?? '') : 'Forbidden';
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

// 2. Only Meta can post here: the body is signed with your app secret
$raw = (string)file_get_contents('php://input');
$sig = (string)($_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '');
if (empty($w['app_secret']) || !hash_equals('sha256=' . hash_hmac('sha256', $raw, (string)$w['app_secret']), $sig)) { http_response_code(403); exit; }

$d = json_decode($raw, true) ?: [];
foreach ($d['entry'] ?? [] as $entry) {
    foreach ($entry['changes'] ?? [] as $ch) {
        $v = $ch['value'] ?? [];
        $names = [];
        foreach ($v['contacts'] ?? [] as $c) $names[(string)($c['wa_id'] ?? '')] = (string)($c['profile']['name'] ?? '');
        foreach ($v['messages'] ?? [] as $m) {
            $from = preg_replace('/\D/', '', (string)($m['from'] ?? ''));
            if ($from === '') continue;
            $type = (string)($m['type'] ?? 'text');
            $text = match ($type) {
                'text' => (string)($m['text']['body'] ?? ''),
                'button' => (string)($m['button']['text'] ?? ''),
                'interactive' => (string)($m['interactive']['button_reply']['title'] ?? $m['interactive']['list_reply']['title'] ?? ''),
                default => "[$type: open WhatsApp to see it]",
            };
            $who = trim(($names[$from] ?? '') . " (+$from)");
            notify_admins("WhatsApp reply from $who", "$who replied on WhatsApp:\n\n" . mb_substr($text, 0, 4000) .
                "\n\nAnswer them on WhatsApp: https://wa.me/$from\n(Replies within 24 hours of their message can be free-form; after that only approved templates can be sent.)");
        }
    }
}
http_response_code(200);
echo 'OK';
