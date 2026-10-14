<?php
// Tiny cookie-jar HTTP client used by the HTTP-level tests and the crawler.
final class Browser
{
    public string $jar;
    public function __construct(public string $base) { $this->jar = tempnam(sys_get_temp_dir(), 'afjar'); }
    public function req(string $method, string $path, array|string $post = [], array $headers = []): array
    {
        $ch = curl_init($this->base . $path);
        curl_setopt_array($ch, [CURLOPT_CUSTOMREQUEST => $method, CURLOPT_RETURNTRANSFER => true, CURLOPT_HEADER => true, CURLOPT_COOKIEJAR => $this->jar, CURLOPT_COOKIEFILE => $this->jar,
            CURLOPT_FOLLOWLOCATION => false, CURLOPT_TIMEOUT => 30, CURLOPT_HTTPHEADER => $headers]);
        if ($method === 'POST') curl_setopt($ch, CURLOPT_POSTFIELDS, is_array($post) ? http_build_query($post) : $post);
        $raw = curl_exec($ch);
        $size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        $r = ['status' => (int)curl_getinfo($ch, CURLINFO_HTTP_CODE), 'headers' => substr((string)$raw, 0, $size), 'body' => substr((string)$raw, $size)];
        curl_close($ch);
        $r['location'] = preg_match('/^location:\s*(\S+)/mi', $r['headers'], $m) ? $m[1] : null;
        return $r;
    }
    public function get(string $p, array $h = []): array { return $this->req('GET', $p, [], $h); }
    public function csrf(string $page = '/login'): string
    {
        $r = $this->get($page);
        return preg_match('/name="csrf" content="([a-f0-9]+)"/', $r['body'], $m) ? $m[1] : '';
    }
    public function post(string $p, array $data, ?string $csrfFrom = null): array
    {
        if (!isset($data['_csrf']) && $csrfFrom !== '') $data['_csrf'] = $this->csrf($csrfFrom ?? $p);
        return $this->req('POST', $p, $data);
    }
    public function login(string $email, string $pw = 'Passw0rd-Demo1'): array
    {
        $tok = $this->csrf('/login');
        return $this->req('POST', '/login', ['email' => $email, 'password' => $pw, '_csrf' => $tok]);
    }
    public function follow(array $r): array { return $r['location'] ? $this->get($r['location']) : $r; }
}
