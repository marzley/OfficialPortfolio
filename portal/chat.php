<?php
// AI answers for the website chat, using Claude through the official Anthropic PHP SDK.
// Off until you add a 'chat' => ['api_key' => ...] block to portal-config.php; the chat then
// answers from data/knowledge.json on its own.
//
// GET  chat.php  -> {"enabled": true|false}
// POST chat.php  {"messages": [{"role": "user"|"assistant", "content": "..."}]}  -> {"reply": "...", "links": [[label, url]]}
define('MARZLEY_PORTAL', true);
define('MARZLEY_NO_EXIT', true);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$reply = function (int $code, array $data) { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; };

$portalConfig = array_filter([getenv('PORTAL_CONFIG') ?: ($_SERVER['PORTAL_CONFIG'] ?? null), dirname(__DIR__, 2) . '/portal-config.php', dirname(__DIR__) . '/portal-config.php'], 'is_readable');
$autoload = dirname(__DIR__) . '/phpvendor/autoload.php';
if (!$portalConfig || !is_readable($autoload)) $reply(200, ['enabled' => false]);
require __DIR__ . '/lib.php';
$chat = (config()['chat'] ?? null) ?: [];
$chat += ['model' => 'claude-opus-5', 'effort' => 'low', 'per_visitor_hour' => 20, 'daily_limit' => 400, 'base_url' => null];
if (empty($chat['api_key'])) $reply(200, ['enabled' => false]);
if ($_SERVER['REQUEST_METHOD'] === 'GET') $reply(200, ['enabled' => true]);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') $reply(405, ['error' => 'Use POST.']);
install_error_alerts('website chat');
require $autoload;

// ---------- limits: per visitor and per day (keeps the bill predictable) ----------
if (!rate_ok('chat', (int)$chat['per_visitor_hour'], 3600)) $reply(429, ['error' => 'limit']);
$dayFile = private_dir() . '/chat_count_' . date('Y-m-d');
$today = (int)@file_get_contents($dayFile);
if ($today >= (int)$chat['daily_limit']) $reply(429, ['error' => 'limit']);
@file_put_contents($dayFile, (string)($today + 1), LOCK_EX);
foreach (glob(private_dir() . '/chat_count_*') ?: [] as $old) if ($old !== $dayFile && filemtime($old) < time() - 3 * 86400) @unlink($old);

// ---------- the conversation: last 8 turns, user first, alternating, short ----------
$in = json_decode((string)file_get_contents('php://input'), true);
$turns = [];
foreach (array_slice(is_array($in['messages'] ?? null) ? $in['messages'] : [], -8) as $m) {
    $role = ($m['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
    $text = trim(mb_substr((string)($m['content'] ?? ''), 0, 800));
    if ($text === '') continue;
    if ($turns && end($turns)['role'] === $role) { $turns[count($turns) - 1]['content'] .= "\n" . $text; continue; }
    $turns[] = ['role' => $role, 'content' => $text];
}
while ($turns && $turns[0]['role'] !== 'user') array_shift($turns);
if (!$turns || end($turns)['role'] !== 'user') $reply(400, ['error' => 'Ask a question.']);

// ---------- system prompt: fixed text + the knowledge base (cached between requests) ----------
$kb = json_decode((string)@file_get_contents(site_root() . '/data/knowledge.json'), true) ?: ['entries' => [], 'business' => []];
$allowed = ['#callback' => true];
$facts = '';
foreach ($kb['entries'] as $e) {
    $facts .= "## {$e['title']}\n{$e['a']}\n";
    foreach ($e['l'] as $l) { $facts .= "Link: {$l[0]} -> {$l[1]}\n"; $allowed[$l[1]] = true; }
    $facts .= "\n";
}
$b = $kb['business'];
$system = <<<TXT
You are the website assistant for Marzley Tech Solutions, a web development, systems and IT training business in Kenya founded by Kelvin Wanyoike (Marzley). Visitors are potential clients, current clients and students.

How to answer:
- Answer in 1–4 short sentences (under 90 words), warm and plain, in the same language the visitor writes in (English, Kiswahili or Sheng). Speak as "we".
- Use only the facts below for anything about Marzley Tech: prices, packages, timelines, services, policies, contacts. Never invent prices, discounts, dates, guarantees or features. If the facts don't cover it, say we'll confirm and suggest WhatsApp ({$b['phone']}) or a call back.
- You may also answer general questions about websites, M-Pesa, hosting, SEO, design and learning to code, briefly and accurately, then relate them to how we can help.
- Politely decline anything unrelated to technology or our services, and anything harmful. Never ask for M-Pesa PINs, passwords or card numbers.
- For account-specific questions (a particular invoice, project status), point them to the client portal or WhatsApp; you can't see their account.
- Plain text only: no markdown, no bullet symbols, no headings.
- After your answer you may add up to 2 lines in exactly this form, choosing only links listed in the facts:
LINK: label | url

Business: {$b['name']} · Phone/WhatsApp {$b['phone']} · Email {$b['email']} · M-Pesa Till {$b['till']} · Open {$b['hours']} · Based in {$b['location']}

# Facts
$facts
TXT;

try {
    $client = new Anthropic\Client(apiKey: $chat['api_key'], baseUrl: $chat['base_url'] ?: null, requestOptions: ['timeout' => 30.0, 'maxRetries' => 1]);
    $msg = $client->beta->messages->create(
        model: $chat['model'],
        maxTokens: 2000,
        system: [['type' => 'text', 'text' => $system, 'cacheControl' => ['type' => 'ephemeral']]],
        messages: $turns,
        outputConfig: ['effort' => $chat['effort']],
        fallbacks: 'default',
        betas: ['server-side-fallback-2026-07-01'],
    );
} catch (Anthropic\Core\Exceptions\AuthenticationException | Anthropic\Core\Exceptions\PermissionDeniedException $e) {
    report_error('website chat', 'The Claude API key was refused: ' . $e->getMessage());
    $reply(503, ['error' => 'unavailable']);
} catch (Anthropic\Core\Exceptions\RateLimitException $e) {
    $reply(503, ['error' => 'busy']);
} catch (Anthropic\Core\Exceptions\BadRequestException $e) {
    report_error('website chat', 'Bad request to Claude: ' . $e->getMessage());
    $reply(503, ['error' => 'unavailable']);
} catch (Anthropic\Core\Exceptions\APIStatusException $e) {
    $reply(503, ['error' => 'unavailable']);                 // 5xx / overloaded: the page falls back to its own answers
} catch (Anthropic\Core\Exceptions\APIConnectionException $e) {
    $reply(503, ['error' => 'unavailable']);                 // network or timeout
}

if ($msg->stopReason === 'refusal') $reply(200, ['reply' => "That's not something we can help with here. For anything about websites, systems, payments or training, ask away, or WhatsApp us on {$b['phone']}.", 'links' => []]);
$text = '';
foreach ($msg->content as $block) if ($block->type === 'text') $text .= $block->text;
if (trim($text) === '') $reply(503, ['error' => 'unavailable']);

// Pull out LINK lines, keeping only links from the knowledge base
$links = [];
$answer = trim(preg_replace_callback('/^\s*LINK:\s*(.+?)\s*\|\s*(\S+)\s*$/mi', function ($m) use (&$links, $allowed) {
    if (isset($allowed[$m[2]]) && count($links) < 2) $links[] = [mb_substr($m[1], 0, 40), $m[2]];
    return '';
}, $text));
$answer = trim(preg_replace(['/\*\*(.+?)\*\*/', '/^#+\s*/m', "/\n{3,}/"], ['$1', '', "\n\n"], $answer));
$reply(200, ['reply' => mb_substr($answer, 0, 1200), 'links' => $links]);
