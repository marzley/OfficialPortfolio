<?php
declare(strict_types=1);
namespace Akiba\Payments;

use Akiba\Core\{Clock, Db, Env};
use Akiba\Services\PaymentService;

/**
 * DEVELOPMENT ONLY. A local stand-in for Daraja so the full flow (request → callback → verification →
 * allocation) can be exercised without Safaricom credentials. It is refused when APP_ENV=production.
 * Results come from an explicit "sandbox phone" screen — nothing is ever auto-confirmed.
 */
final class SandboxDriver implements PaymentDriver
{
    public function __construct()
    {
        if (Env::isProduction()) throw new \RuntimeException('The sandbox payment simulator is disabled in production.');
    }

    public function name(): string { return 'sandbox'; }

    public function initiate(array $req): array
    {
        $checkout = 'ws_CO_SBX_' . bin2hex(random_bytes(8));
        $merchant = 'SBX-' . bin2hex(random_bytes(6));
        Db::i()->exec('INSERT INTO sandbox_stk (checkout_id,merchant_id,amount_minor,phone,created_at) VALUES (?,?,?,?,?)',
            [$checkout, $merchant, $req['amount_minor'], $req['phone'], Clock::nowSql()]);
        return ['ok' => true, 'checkout_id' => $checkout, 'merchant_id' => $merchant, 'message' => 'Sandbox prompt created (open the sandbox phone to respond)'];
    }

    public function query(string $checkoutId): array
    {
        $r = Db::i()->one('SELECT state FROM sandbox_stk WHERE checkout_id=?', [$checkoutId]);
        if (!$r) return ['status' => 'error', 'code' => '404', 'desc' => 'Unknown checkout id'];
        return match ($r['state']) {
            'success' => ['status' => 'success', 'code' => '0', 'desc' => 'The service request is processed successfully.'],
            'cancelled' => ['status' => 'failed', 'code' => '1032', 'desc' => 'Request cancelled by user'],
            'insufficient' => ['status' => 'failed', 'code' => '1', 'desc' => 'The balance is insufficient for the transaction'],
            default => ['status' => 'pending', 'code' => '4999', 'desc' => 'The transaction is still under processing'],
        };
    }

    /** The "customer" answers the prompt. Delivers a Daraja-shaped callback through the real callback handler. */
    public static function respond(string $checkoutId, string $outcome, ?int $paidMinor = null): array
    {
        $db = Db::i();
        $s = $db->one('SELECT * FROM sandbox_stk WHERE checkout_id=?', [$checkoutId]);
        if (!$s || $s['state'] !== 'prompted') return ['http' => 409, 'body' => ['error' => 'Prompt already answered or unknown']];
        $state = match ($outcome) { 'pay' => 'success', 'insufficient' => 'insufficient', default => 'cancelled' };
        $receipt = $state === 'success' ? 'SBX' . strtoupper(bin2hex(random_bytes(5))) : null;
        $db->exec('UPDATE sandbox_stk SET state=?, receipt=? WHERE checkout_id=?', [$state, $receipt, $checkoutId]);
        $amountMinor = $paidMinor ?? (int)$s['amount_minor'];
        $cb = ['MerchantRequestID' => $s['merchant_id'], 'CheckoutRequestID' => $checkoutId];
        if ($state === 'success') {
            $cb += ['ResultCode' => 0, 'ResultDesc' => 'The service request is processed successfully.', 'CallbackMetadata' => ['Item' => [
                ['Name' => 'Amount', 'Value' => (int)($amountMinor / 100)],
                ['Name' => 'MpesaReceiptNumber', 'Value' => $receipt],
                ['Name' => 'TransactionDate', 'Value' => (int)Clock::now()->format('YmdHis')],
                ['Name' => 'PhoneNumber', 'Value' => (int)ltrim($s['phone'], '+')],
            ]]];
        } else {
            $cb += $state === 'cancelled' ? ['ResultCode' => 1032, 'ResultDesc' => 'Request cancelled by user'] : ['ResultCode' => 1, 'ResultDesc' => 'The balance is insufficient for the transaction'];
        }
        return PaymentService::handleStkCallback(['Body' => ['stkCallback' => $cb]], 'sandbox', 'sandbox');
    }
}
