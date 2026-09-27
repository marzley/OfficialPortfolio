<?php
// Free website health check: fetches one public web page and reports on
// security, speed, mobile and SEO basics. Returns JSON.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function done(int $code, array $data): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') done(405, ['error' => 'Use POST.']);

// ---------- rate limit: 10 checks per visitor per hour ----------
$privateDir = is_writable(dirname(__DIR__)) ? dirname(__DIR__) : __DIR__;
$limitDir = $privateDir . '/healthcheck_ratelimit';
if (!is_dir($limitDir)) @mkdir($limitDir, 0750, true);
$ipKey = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|marzley');
$limitFile = $limitDir . '/' . $ipKey;
$hits = array_filter(explode("\n", (string)@file_get_contents($limitFile)), fn($t) => (int)$t > time() - 3600);
if (count($hits) >= 10) done(429, ['error' => 'You’ve run a lot of checks. Please try again in an hour.']);
$hits[] = time();
@file_put_contents($limitFile, implode("\n", $hits), LOCK_EX);

// ---------- which address to check ----------
$input = trim((string)($_POST['url'] ?? ''));
if ($input === '' || strlen($input) > 300) done(400, ['error' => 'Enter your website address, like example.co.ke']);
if (!preg_match('#^https?://#i', $input)) $input = 'https://' . $input;

/** Only public web servers on the normal ports: never this server or private networks. */
function safe_target(string $url): ?array {
    $p = parse_url($url);
    if (!$p || !isset($p['host']) || !in_array(strtolower($p['scheme'] ?? ''), ['http', 'https'], true)) return null;
    if (isset($p['user']) || isset($p['pass'])) return null;
    $scheme = strtolower($p['scheme']);
    $port = $p['port'] ?? ($scheme === 'https' ? 443 : 80);
    if (!in_array($port, [80, 443], true)) return null;
    $host = strtolower(rtrim($p['host'], '.'));
    if (!preg_match('/^[a-z0-9.-]+\.[a-z]{2,}$/', $host)) return null; // a real domain name, not an IP address
    $ips = @gethostbynamel($host);
    if (!$ips) return null;
    foreach ($ips as $ip) {
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) return null;
        if (str_starts_with($ip, '100.') && (int)explode('.', $ip)[1] >= 64 && (int)explode('.', $ip)[1] <= 127) return null;
    }
    return ['scheme' => $scheme, 'host' => $host, 'port' => $port, 'ip' => $ips[0]];
}

/** Fetch one URL pinned to the checked IP address, without following redirects. */
function fetch_once(string $url, array $t): array {
    $body = '';
    $headers = [];
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RESOLVE => [$t['host'] . ':' . $t['port'] . ':' . $t['ip']],
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_ENCODING => '',
        CURLOPT_USERAGENT => 'MarzleyTechHealthCheck/1.0 (+https://marzleytechsolutions.co.ke/website-check)',
        CURLOPT_HEADERFUNCTION => function ($ch, $line) use (&$headers) {
            $parts = explode(':', $line, 2);
            if (count($parts) === 2) $headers[strtolower(trim($parts[0]))] = trim($parts[1]);
            return strlen($line);
        },
        CURLOPT_WRITEFUNCTION => function ($ch, $chunk) use (&$body) {
            $body .= $chunk;
            return strlen($body) > 1500000 ? 0 : strlen($chunk); // stop after 1.5 MB
        },
    ]);
    if (defined('CURLOPT_PROTOCOLS_STR')) curl_setopt($ch, CURLOPT_PROTOCOLS_STR, 'http,https');
    curl_exec($ch);
    $info = curl_getinfo($ch);
    $err = curl_errno($ch);
    curl_close($ch);
    return ['status' => (int)$info['http_code'], 'time' => (float)$info['total_time'], 'headers' => $headers, 'body' => $body,
            'error' => $err && $err !== CURLE_WRITE_ERROR ? $err : 0];
}

/** Score one fetched page. */
function analyse(string $html, string $finalScheme, ?bool $httpsRedirect, float $totalTime, array $headers): array {
    libxml_use_internal_errors(true);
    $doc = new DOMDocument();
    $doc->loadHTML('<?xml encoding="utf-8"?>' . $html, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
    $xp = new DOMXPath($doc);
    $first = function (string $q) use ($xp) { $n = $xp->query($q); return $n && $n->length ? $n->item(0) : null; };

    $title = trim((string)($first('//title')?->textContent ?? ''));
    $desc = trim((string)($first('//meta[translate(@name,"DESCRIPTION","description")="description"]')?->getAttribute('content') ?? ''));
    $viewport = (bool)$first('//meta[translate(@name,"VIEWPORT","viewport")="viewport"]');
    $h1s = $xp->query('//h1')->length;
    $imgs = $xp->query('//img');
    $noAlt = 0;
    foreach ($imgs as $img) if (!$img->hasAttribute('alt')) $noAlt++;
    $lang = trim((string)($first('//html')?->getAttribute('lang') ?? ''));
    $ogImage = (bool)$first('//meta[@property="og:image"]');
    $icon = (bool)$first('//link[contains(translate(@rel,"ICON","icon"),"icon")]');
    $sizeKb = round(strlen($html) / 1024);
    $compressed = isset($headers['content-encoding']);

    $checks = [];
    $add = function (string $group, string $label, bool $ok, string $detail, string $tip) use (&$checks) {
        $checks[] = compact('group', 'label', 'ok', 'detail', 'tip');
    };
    $add('Security', 'Secure connection (https)', $finalScheme === 'https',
        $finalScheme === 'https' ? 'Your site loads over https.' : 'Your site loads without https.',
        'Install a free SSL certificate so browsers don’t mark your site “Not secure”.');
    if ($httpsRedirect !== null) $add('Security', 'http:// redirects to https://', $httpsRedirect,
        $httpsRedirect ? 'Visitors typing http:// are sent to the secure site.' : 'Visitors typing http:// stay on the insecure version.',
        'Redirect all http:// visits to https:// on the server.');
    $add('Speed', 'Loads quickly', $totalTime < 2.5, sprintf('The page took %.1f seconds to load from our server.', $totalTime),
        'Optimise images, use caching and better hosting to get under 2.5 seconds.');
    $add('Speed', 'Page size', $sizeKb < 600, "The page’s HTML is {$sizeKb} KB.", 'Remove unused code and inline content to keep pages light on mobile data.');
    $add('Speed', 'Compression', $compressed, $compressed ? 'The server compresses pages.' : 'The server doesn’t compress pages.',
        'Turn on gzip or Brotli compression on your hosting to cut download size.');
    $add('Mobile', 'Mobile-friendly setup', $viewport, $viewport ? 'The page is set up for phone screens.' : 'The page isn’t set up for phone screens (no viewport tag).',
        'Add a viewport tag and a responsive design so the site works well on phones.');
    $tl = mb_strlen($title);
    $add('SEO', 'Page title', $tl >= 10 && $tl <= 65, $title ? "Title: “" . mb_substr($title, 0, 80) . "” ($tl characters)." : 'The page has no title.',
        'Write a clear title of 10–65 characters with your main service and location.');
    $dl = mb_strlen($desc);
    $add('SEO', 'Search description', $dl >= 50 && $dl <= 165, $desc ? "Description is $dl characters." : 'The page has no search description.',
        'Add a 50–160 character description; Google often shows it under your link.');
    $add('SEO', 'One main heading', $h1s === 1, "The page has $h1s main heading" . ($h1s === 1 ? '.' : 's (h1).'),
        'Use exactly one h1 heading that says what the page is about.');
    $add('SEO', 'Image descriptions', $noAlt === 0, $imgs->length ? "$noAlt of {$imgs->length} images have no description (alt text)." : 'No images found.',
        'Describe each image with alt text, for search engines and blind visitors.');
    $add('SEO', 'Language set', $lang !== '', $lang ? "Language: $lang." : 'The page doesn’t say which language it’s in.',
        'Add lang="en" (or your language) to the page so search engines and screen readers get it right.');
    $add('Sharing', 'Share preview image', $ogImage, $ogImage ? 'Links shared on WhatsApp and Facebook show an image.' : 'Shared links show no preview image.',
        'Add an og:image so your link looks good when shared.');
    $add('Sharing', 'Site icon', $icon, $icon ? 'The site has a browser icon.' : 'The site has no browser icon (favicon).',
        'Add a favicon so your brand shows in browser tabs and bookmarks.');
    return $checks;
}

if (PHP_SAPI === 'cli' && getenv('HEALTHCHECK_TEST')) return;

$url = $input;
$start = microtime(true);
$redirects = 0;
$httpsRedirect = null;
while (true) {
    $target = safe_target($url);
    if (!$target) done(400, ['error' => 'That address can’t be checked. Enter a public website address, like example.co.ke']);
    $res = fetch_once($url, $target);
    if ($res['error'] || $res['status'] === 0) done(502, ['error' => 'We couldn’t reach that website. Check the address and try again.']);
    if ($res['status'] >= 300 && $res['status'] < 400 && isset($res['headers']['location']) && $redirects < 4) {
        $next = $res['headers']['location'];
        if (!preg_match('#^https?://#i', $next)) {
            $next = $target['scheme'] . '://' . $target['host'] . (str_starts_with($next, '/') ? '' : '/') . $next;
        }
        $url = $next;
        $redirects++;
        continue;
    }
    break;
}
$totalTime = microtime(true) - $start;
if ($res['status'] >= 400) done(502, ['error' => 'That website answered with an error (' . $res['status'] . '). Check the address and try again.']);

// Does plain http:// send visitors to the secure address?
$finalScheme = parse_url($url, PHP_URL_SCHEME);
$hostOnly = parse_url($url, PHP_URL_HOST);
$httpTarget = safe_target('http://' . $hostOnly . '/');
if ($httpTarget) {
    $plain = fetch_once('http://' . $hostOnly . '/', $httpTarget);
    $loc = $plain['headers']['location'] ?? '';
    $httpsRedirect = $plain['status'] >= 300 && $plain['status'] < 400 && stripos($loc, 'https://') === 0;
}

$checks = analyse($res['body'], (string)$finalScheme, $httpsRedirect, $totalTime, $res['headers']);
$passed = count(array_filter($checks, fn($c) => $c['ok']));
done(200, [
    'url' => $url,
    'score' => (int)round($passed / count($checks) * 100),
    'passed' => $passed,
    'total' => count($checks),
    'checks' => $checks,
]);
