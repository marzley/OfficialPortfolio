<?php
declare(strict_types=1);
namespace Akiba\Http;

use Akiba\Core\{Env, Http};
use Akiba\Services\PaymentService;

/**
 * Provider webhooks. Safaricom does not sign callbacks, so we layer: unguessable secret in the URL,
 * optional source-IP allowlist, strict payload validation, de-duplication, and — before any money is
 * credited — an independent status query (see PaymentService::settle). Responses never leak internals.
 */
final class CallbackController
{
    private static function guard(string $secret): array
    {
        $expected = Env::get('MPESA_CALLBACK_SECRET', '');
        if ($expected === '' || strlen($expected) < 12 || !hash_equals($expected, $secret)) Http::json(['error' => 'Not found'], 404);
        $allow = array_filter(array_map('trim', explode(',', (string)Env::get('MPESA_CALLBACK_IP_ALLOWLIST', ''))));
        if ($allow && !in_array(Http::ip(), $allow, true)) {
            error_log('[callback] rejected source ip ' . Http::ip());
            Http::json(['error' => 'Forbidden'], 403);
        }
        $raw = file_get_contents('php://input', false, null, 0, 65537);
        if ($raw === false || strlen($raw) > 65536) Http::json(['error' => 'Payload too large'], 413);
        $data = json_decode($raw, true);
        if (!is_array($data)) Http::json(['ResultCode' => 1, 'ResultDesc' => 'Invalid JSON'], 400);
        return $data;
    }

    public static function stk(string $secret): void
    {
        $res = PaymentService::handleStkCallback(self::guard($secret), Http::ip(), 'mpesa');
        Http::json($res['body'], $res['http']);
    }

    public static function c2b(string $secret): void
    {
        $res = PaymentService::handleC2bConfirmation(self::guard($secret), Http::ip());
        Http::json($res['body'], $res['http']);
    }
}
