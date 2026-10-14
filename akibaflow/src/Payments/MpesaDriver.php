<?php
declare(strict_types=1);
namespace Akiba\Payments;

use Akiba\Core\{Clock, Db, Env, Phone};

/**
 * Safaricom Daraja (M-PESA Express / STK Push) client.
 * NOT yet exercised against the live Daraja sandbox from this codebase — requires consumer key/secret,
 * shortcode and passkey from a Safaricom developer account (see docs/PAYMENT_INTEGRATION.md).
 * Request construction and response handling are covered by unit tests with an injected transport.
 */
final class MpesaDriver implements PaymentDriver
{
    /** @var callable(string,string,array,?string):array{0:int,1:string} */
    private $transport;

    public function __construct(?callable $transport = null)
    {
        $this->transport = $transport ?? [self::class, 'curlTransport'];
    }

    public function name(): string { return 'mpesa'; }

    public static function configured(): bool
    {
        foreach (['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_SHORTCODE', 'MPESA_PASSKEY', 'MPESA_CALLBACK_SECRET'] as $k) {
            if (!Env::get($k)) return false;
        }
        return true;
    }

    private function base(): string
    {
        return Env::get('MPESA_ENV', 'sandbox') === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';
    }

    public static function curlTransport(string $method, string $url, array $headers, ?string $body): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_CUSTOMREQUEST => $method, CURLOPT_HTTPHEADER => $headers, CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 25, CURLOPT_CONNECTTIMEOUT => 10, CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2]);
        if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        $out = curl_exec($ch);
        if ($out === false) { $e = curl_error($ch); curl_close($ch); throw new \RuntimeException('transport: ' . $e); }
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return [$code, (string)$out];
    }

    private function token(): string
    {
        $file = AF_ROOT . '/storage/mpesa_token.json';
        $cached = is_file($file) ? json_decode((string)file_get_contents($file), true) : null;
        if ($cached && $cached['exp'] > time() + 30 && ($cached['env'] ?? '') === Env::get('MPESA_ENV', 'sandbox')) return $cached['token'];
        [$code, $body] = ($this->transport)('GET', $this->base() . '/oauth/v1/generate?grant_type=client_credentials',
            ['Authorization: Basic ' . base64_encode(Env::get('MPESA_CONSUMER_KEY') . ':' . Env::get('MPESA_CONSUMER_SECRET'))], null);
        $j = json_decode($body, true);
        if ($code !== 200 || empty($j['access_token'])) throw new \RuntimeException("Daraja auth failed (HTTP $code)");
        file_put_contents($file, json_encode(['token' => $j['access_token'], 'exp' => time() + (int)($j['expires_in'] ?? 3000), 'env' => Env::get('MPESA_ENV', 'sandbox')]), LOCK_EX);
        @chmod($file, 0600);
        return $j['access_token'];
    }

    /** Used by the admin "test connection" button: proves credentials work without moving money. */
    public function testConnection(): array
    {
        try {
            @unlink(AF_ROOT . '/storage/mpesa_token.json');
            $this->token();
            return ['ok' => true, 'message' => 'Authenticated with Daraja (' . Env::get('MPESA_ENV', 'sandbox') . ').'];
        } catch (\Throwable $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }
    }

    public function callbackUrl(): string
    {
        return rtrim((string)Env::get('APP_URL'), '/') . '/callbacks/mpesa/stk/' . Env::get('MPESA_CALLBACK_SECRET');
    }

    public function buildStkBody(array $req, ?string $ts = null): array
    {
        $ts ??= Clock::now()->format('YmdHis');
        $short = Env::get('MPESA_SHORTCODE');
        return [
            'BusinessShortCode' => (int)$short,
            'Password' => base64_encode($short . Env::get('MPESA_PASSKEY') . $ts),
            'Timestamp' => $ts,
            'TransactionType' => Env::get('MPESA_TXN_TYPE', 'CustomerPayBillOnline'),
            'Amount' => intdiv($req['amount_minor'], 100), // Daraja accepts whole shillings only
            'PartyA' => (int)Phone::msisdn($req['phone']),
            'PartyB' => (int)$short,
            'PhoneNumber' => (int)Phone::msisdn($req['phone']),
            'CallBackURL' => $this->callbackUrl(),
            'AccountReference' => mb_substr($req['reference'], 0, 12),
            'TransactionDesc' => mb_substr($req['description'], 0, 13),
        ];
    }

    public function initiate(array $req): array
    {
        if ($req['amount_minor'] % 100 !== 0) return ['ok' => false, 'message' => 'M-PESA accepts whole shillings only'];
        try {
            $tok = $this->token();
            [$code, $body] = ($this->transport)('POST', $this->base() . '/mpesa/stkpush/v1/processrequest',
                ['Authorization: Bearer ' . $tok, 'Content-Type: application/json'], json_encode($this->buildStkBody($req)));
        } catch (\Throwable $e) {
            // We cannot tell whether Safaricom received the request → caller must treat as UNKNOWN, not failed.
            return ['ok' => false, 'unknown' => str_starts_with($e->getMessage(), 'transport'), 'message' => $e->getMessage()];
        }
        $j = json_decode($body, true) ?: [];
        if ($code === 200 && ($j['ResponseCode'] ?? '') === '0' && !empty($j['CheckoutRequestID'])) {
            return ['ok' => true, 'checkout_id' => $j['CheckoutRequestID'], 'merchant_id' => $j['MerchantRequestID'] ?? '', 'message' => $j['CustomerMessage'] ?? 'Prompt sent'];
        }
        if ($code >= 500) return ['ok' => false, 'unknown' => true, 'message' => "Daraja HTTP $code"];
        return ['ok' => false, 'message' => $j['errorMessage'] ?? $j['ResponseDescription'] ?? "Daraja HTTP $code"];
    }

    public function query(string $checkoutId): array
    {
        $ts = Clock::now()->format('YmdHis');
        $short = Env::get('MPESA_SHORTCODE');
        try {
            [$code, $body] = ($this->transport)('POST', $this->base() . '/mpesa/stkpushquery/v1/query',
                ['Authorization: Bearer ' . $this->token(), 'Content-Type: application/json'],
                json_encode(['BusinessShortCode' => (int)$short, 'Password' => base64_encode($short . Env::get('MPESA_PASSKEY') . $ts), 'Timestamp' => $ts, 'CheckoutRequestID' => $checkoutId]));
        } catch (\Throwable $e) {
            return ['status' => 'error', 'code' => 'transport', 'desc' => $e->getMessage()];
        }
        $j = json_decode($body, true) ?: [];
        // Daraja answers 500 with errorCode 500.001.1001 while the transaction is still being processed.
        if (isset($j['errorCode']) && str_contains((string)$j['errorCode'], '1001')) return ['status' => 'pending', 'code' => (string)$j['errorCode'], 'desc' => (string)($j['errorMessage'] ?? 'processing')];
        if ($code !== 200 || !array_key_exists('ResultCode', $j)) return ['status' => 'error', 'code' => (string)$code, 'desc' => (string)($j['errorMessage'] ?? 'unexpected response')];
        return (string)$j['ResultCode'] === '0'
            ? ['status' => 'success', 'code' => '0', 'desc' => (string)($j['ResultDesc'] ?? '')]
            : ['status' => 'failed', 'code' => (string)$j['ResultCode'], 'desc' => (string)($j['ResultDesc'] ?? '')];
    }
}
