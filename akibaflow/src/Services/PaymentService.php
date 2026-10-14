<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Audit, Clock, Db, Env, Money, Phone};
use Akiba\Payments\{MpesaDriver, PaymentDriver, SandboxDriver};

final class PaymentService
{
    private static ?PaymentDriver $driver = null;

    public static function setDriver(?PaymentDriver $d): void { self::$driver = $d; }

    public static function driver(): PaymentDriver
    {
        if (self::$driver) return self::$driver;
        $name = Env::get('PAYMENT_DRIVER', 'sandbox');
        if ($name === 'mpesa') {
            if (!MpesaDriver::configured()) throw new \RuntimeException('M-PESA is selected but credentials are not configured (see docs/PAYMENT_INTEGRATION.md).');
            return self::$driver = new MpesaDriver();
        }
        return self::$driver = new SandboxDriver();
    }

    public static function newRef(string $prefix): string
    {
        $a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        $s = '';
        for ($i = 0; $i < 12; $i++) $s .= $a[random_int(0, strlen($a) - 1)];
        return $prefix . $s;
    }

    // ------------------------------------------------------------------ amounts

    /** What the member can pay right now. All figures come from obligation rows; the client never supplies the "official" amount. */
    public static function quote(array $m): array
    {
        $today = Clock::today($m['timezone']);
        $bal = ContributionEngine::balance((int)$m['id'], $today);
        $set = GroupService::settings((int)$m['group_id']);
        $db = Db::i();
        $next = $db->one("SELECT due_date, SUM(original_minor-waived_minor-paid_minor) AS amt FROM contribution_obligations
                          WHERE membership_id=? AND status='open' AND kind='contribution' AND due_date>? GROUP BY due_date ORDER BY due_date LIMIT 1", [$m['id'], $today]);
        return [
            'today' => $today,
            'balance' => $bal,
            'pay_today' => $bal['due_today'],
            'clear_all' => $bal['outstanding_total'],
            'advance' => ((int)$set['allow_advance'] && $next) ? ['amount' => (int)$next['amt'], 'due_date' => $next['due_date']] : null,
            'allow_partial' => (bool)$set['allow_partial'],
            'allow_advance' => (bool)$set['allow_advance'],
            'max_custom' => (int)$set['allow_advance'] ? $bal['outstanding_total'] + $bal['upcoming_minor'] : $bal['outstanding_total'],
            'currency' => $m['currency'],
        ];
    }

    private static function prefixSums(int $membershipId, string $today): array
    {
        $sum = 0;
        $out = [];
        foreach (Db::i()->all("SELECT original_minor-waived_minor-paid_minor AS o FROM contribution_obligations WHERE membership_id=? AND status='open' AND due_date<=? ORDER BY (kind='penalty'), due_date, id", [$membershipId, $today]) as $r) {
            $sum += (int)$r['o'];
            $out[] = $sum;
        }
        return $out;
    }

    /** @return array{ok:bool,request?:array,error?:string,replayed?:bool} */
    public static function initiate(array $m, string $option, ?int $customMinor, string $phoneRaw, string $idemKey): array
    {
        $db = Db::i();
        if ($m['group_status'] !== 'active') return ['ok' => false, 'error' => 'This group is not accepting payments.'];
        if (!preg_match('/^[A-Za-z0-9_\-]{8,80}$/', $idemKey)) return ['ok' => false, 'error' => 'Invalid request. Reload the page and try again.'];

        if ($existing = $db->one('SELECT * FROM payment_requests WHERE user_id=? AND idempotency_key=?', [$m['user_id'], $idemKey])) {
            return ['ok' => true, 'request' => $existing, 'replayed' => true];
        }
        $phone = Phone::normalize($phoneRaw);
        if (!$phone) return ['ok' => false, 'error' => 'Enter a valid M-PESA phone number, e.g. 0712 345 678.'];

        $q = self::quote($m);
        $amount = match ($option) {
            'today' => $q['pay_today'],
            'clear_all' => $q['clear_all'],
            'advance' => $q['advance']['amount'] ?? 0,
            'custom' => (int)$customMinor,
            default => 0,
        };
        if (!in_array($option, ['today', 'clear_all', 'advance', 'custom'], true)) return ['ok' => false, 'error' => 'Choose a payment option.'];
        if ($amount <= 0) {
            return ['ok' => false, 'error' => $option === 'today' ? 'Nothing is due today.' : ($option === 'advance' ? 'Advance payments are not available right now.' : 'Enter an amount greater than zero.')];
        }
        if ($option === 'custom') {
            if ($amount > $q['max_custom'] || ($q['max_custom'] === 0)) {
                return ['ok' => false, 'error' => 'That is more than you can pay right now (' . Money::fmt($q['max_custom'], $m['currency']) . ').'];
            }
            if (!$q['allow_partial'] && !in_array($amount, array_merge(self::prefixSums((int)$m['id'], $q['today']), [$q['max_custom']]), true)) {
                return ['ok' => false, 'error' => 'This group does not accept partial payments. Pay whole contributions only.'];
            }
        }
        if ($amount % 100 !== 0) return ['ok' => false, 'error' => 'M-PESA accepts whole shillings only.'];

        // Guard against double charges: one live prompt per member at a time.
        $live = $db->val("SELECT COUNT(*) FROM payment_requests WHERE membership_id=? AND status IN ('created','pending') AND created_at>?",
            [$m['id'], Clock::now()->modify('-3 minutes')->format('Y-m-d H:i:s')]);
        if ((int)$live > 0) return ['ok' => false, 'error' => 'You already have a payment waiting for approval on your phone. Complete it, or wait 3 minutes before trying again.'];

        $driver = self::driver();
        try {
            $rid = $db->insert("INSERT INTO payment_requests (ref,group_id,membership_id,user_id,pay_option,amount_minor,method,phone,idempotency_key,status,provider,created_at,updated_at) VALUES (?,?,?,?,?,?,'mpesa_stk',?,?,'created',?,?,?)",
                [self::newRef('PR'), $m['group_id'], $m['id'], $m['user_id'], $option, $amount, $phone, $idemKey, $driver->name(), Clock::nowSql(), Clock::nowSql()]);
        } catch (\Throwable $e) {
            if (Db::isDuplicate($e)) return ['ok' => true, 'request' => $db->one('SELECT * FROM payment_requests WHERE user_id=? AND idempotency_key=?', [$m['user_id'], $idemKey]), 'replayed' => true];
            throw $e;
        }
        $req = $db->one('SELECT * FROM payment_requests WHERE id=?', [$rid]);

        $res = $driver->initiate(['amount_minor' => $amount, 'phone' => $phone, 'reference' => $m['member_code'], 'description' => 'AkibaFlow']);
        $db->insert('INSERT INTO payment_attempts (request_id,kind,ok,summary,created_at) VALUES (?,?,?,?,?)', [$rid, 'initiate', (int)$res['ok'], mb_substr($res['message'], 0, 400), Clock::nowSql()]);
        if ($res['ok']) {
            $db->exec("UPDATE payment_requests SET status='pending', provider_request_id=?, merchant_request_id=?, updated_at=? WHERE id=?", [$res['checkout_id'], $res['merchant_id'] ?? null, Clock::nowSql(), $rid]);
        } elseif (!empty($res['unknown'])) {
            $db->exec("UPDATE payment_requests SET status='unknown', result_code='INITIATE_UNKNOWN', result_desc=?, updated_at=? WHERE id=?", [mb_substr($res['message'], 0, 250), Clock::nowSql(), $rid]);
        } else {
            $db->exec("UPDATE payment_requests SET status='failed', result_desc=?, updated_at=? WHERE id=?", [mb_substr($res['message'], 0, 250), Clock::nowSql(), $rid]);
        }
        Audit::log('payment.initiated', (int)$m['group_id'], 'payment_request', $rid, ['amount_minor' => $amount, 'option' => $option], (int)$m['user_id']);
        return ['ok' => true, 'request' => $db->one('SELECT * FROM payment_requests WHERE id=?', [$rid])];
    }

    // ------------------------------------------------------------------ provider callbacks

    /** @return array{http:int,body:array} */
    public static function handleStkCallback(array $payload, string $ip, string $providerName): array
    {
        $cb = $payload['Body']['stkCallback'] ?? null;
        if (!is_array($cb) || empty($cb['CheckoutRequestID']) || !array_key_exists('ResultCode', $cb) || !is_string($cb['CheckoutRequestID']) || strlen($cb['CheckoutRequestID']) > 100) {
            return ['http' => 400, 'body' => ['ResultCode' => 1, 'ResultDesc' => 'Malformed callback']];
        }
        $db = Db::i();
        $key = $cb['CheckoutRequestID'];
        $ack = ['http' => 200, 'body' => ['ResultCode' => 0, 'ResultDesc' => 'Accepted']];
        try {
            $eventId = $db->insert('INSERT INTO payment_provider_events (provider,event_type,event_key,payload,source_ip,received_at) VALUES (?,?,?,?,?,?)',
                [$providerName, 'stk_callback', $key, json_encode($payload), $ip, Clock::nowSql()]);
        } catch (\Throwable $e) {
            if (!Db::isDuplicate($e)) throw $e;
            $ev = $db->one("SELECT id,processed_at FROM payment_provider_events WHERE provider=? AND event_type='stk_callback' AND event_key=?", [$providerName, $key]);
            $db->exec('UPDATE payment_provider_events SET duplicate_count=duplicate_count+1 WHERE id=?', [$ev['id']]);
            if ($ev['processed_at'] !== null) return $ack;       // already handled: acknowledge, do nothing
            $eventId = (int)$ev['id'];                           // earlier attempt crashed before finishing: safe to retry (idempotent)
        }
        $req = $db->one('SELECT * FROM payment_requests WHERE provider_request_id=?', [$key]);
        if (!$req) {
            $db->exec("UPDATE payment_provider_events SET processed_at=?, outcome='unmatched_request' WHERE id=?", [Clock::nowSql(), $eventId]);
            return $ack;
        }
        $items = [];
        foreach ($cb['CallbackMetadata']['Item'] ?? [] as $it) {
            if (isset($it['Name'])) $items[$it['Name']] = $it['Value'] ?? null;
        }
        $amountMinor = null;
        if (isset($items['Amount']) && is_numeric($items['Amount'])) $amountMinor = Money::parse(sprintf('%.2F', (float)$items['Amount']));
        $outcome = self::settle($req, [
            'code' => (int)$cb['ResultCode'], 'desc' => (string)($cb['ResultDesc'] ?? ''),
            'amount_minor' => $amountMinor, 'receipt' => isset($items['MpesaReceiptNumber']) ? (string)$items['MpesaReceiptNumber'] : null,
        ]);
        $db->exec('UPDATE payment_provider_events SET processed_at=?, outcome=?, request_id=?, group_id=? WHERE id=?', [Clock::nowSql(), $outcome, $req['id'], $req['group_id'], $eventId]);
        $db->insert('INSERT INTO payment_attempts (request_id,kind,ok,summary,created_at) VALUES (?,?,?,?,?)', [$req['id'], 'callback', (int)($outcome === 'succeeded'), $outcome, Clock::nowSql()]);
        return $ack;
    }

    /** Decide what a callback means for a request. Money is only credited when every check passes. */
    private static function settle(array $req, array $f): string
    {
        $db = Db::i();
        if ($f['code'] !== 0) {
            $n = $db->tx(function () use ($db, $req, $f) {
                $r = $db->one('SELECT status FROM payment_requests WHERE id=? FOR UPDATE', [$req['id']]);
                if ($r['status'] === 'succeeded') return 0;
                return $db->exec("UPDATE payment_requests SET status='failed', result_code=?, result_desc=?, updated_at=? WHERE id=?",
                    [(string)$f['code'], mb_substr($f['desc'], 0, 250), Clock::nowSql(), $req['id']]);
            });
            if ($n) self::notifyFailure($req, $f['desc']);
            return $n ? 'failed' : 'duplicate_ignored';
        }
        if ($f['receipt'] === null || $f['receipt'] === '' || strlen($f['receipt']) > 60) {
            return self::flag($req, 'NO_RECEIPT', 'Success callback without a receipt number', 'invalid_callback');
        }
        if ($f['amount_minor'] !== (int)$req['amount_minor']) {
            return self::flag($req, 'AMOUNT_MISMATCH', 'Amount mismatch: requested ' . Money::fmt((int)$req['amount_minor']) . ', provider reported ' . ($f['amount_minor'] === null ? 'none' : Money::fmt($f['amount_minor'])), 'amount_mismatch');
        }
        if (Env::bool('MPESA_VERIFY_WITH_QUERY', true)) {
            $q = self::driver()->query((string)$req['provider_request_id']);
            if ($q['status'] !== 'success') {
                return self::flag($req, 'UNVERIFIED', 'Callback claimed success but the provider query said "' . $q['status'] . '": ' . $q['desc'], 'unverified');
            }
        }
        $out = $db->tx(function () use ($db, $req, $f) {
            $r = $db->one('SELECT * FROM payment_requests WHERE id=? FOR UPDATE', [$req['id']]);
            if ($r['status'] === 'succeeded') return ['duplicate' => true];
            $p = self::post([
                'group_id' => (int)$r['group_id'], 'membership_id' => (int)$r['membership_id'], 'amount_minor' => (int)$r['amount_minor'],
                'provider' => $r['provider'] === 'sandbox' ? 'sandbox' : 'mpesa', 'provider_ref' => $f['receipt'], 'source' => 'provider_verified',
                'method' => 'mpesa_stk', 'request_id' => (int)$r['id'], 'recorded_by' => null, 'note' => null,
            ]);
            $db->exec("UPDATE payment_requests SET status='succeeded', result_code='0', result_desc=?, provider_receipt=?, txn_id=?, updated_at=? WHERE id=?",
                [mb_substr($f['desc'], 0, 250), $f['receipt'], $p['txn_id'], Clock::nowSql(), $r['id']]);
            return $p;
        });
        if (!empty($out['duplicate'])) return 'duplicate_ignored';
        self::afterPosted((int)$out['txn_id']);
        return 'succeeded';
    }

    private static function flag(array $req, string $code, string $desc, string $outcome): string
    {
        Db::i()->exec("UPDATE payment_requests SET status='unknown', result_code=?, result_desc=?, updated_at=? WHERE id=? AND status<>'succeeded'", [$code, mb_substr($desc, 0, 250), Clock::nowSql(), $req['id']]);
        Notifications::toRoles((int)$req['group_id'], ['treasurer', 'chairperson'], 'payment', 'Payment needs reconciliation', $desc . ' (ref ' . $req['ref'] . ')', '/g/' . $req['group_id'] . '/reconcile', 'recon:' . $req['id'] . ':' . $code);
        return $outcome;
    }

    // ------------------------------------------------------------------ posting

    /**
     * Create the transaction, allocate it and post the ledger — atomically.
     * A repeat of the same (group, provider, provider_ref) returns the existing transaction untouched.
     * @param array{group_id:int,membership_id:int,amount_minor:int,provider:string,provider_ref:string,source:string,method:string,request_id:?int,recorded_by:?int,note:?string} $p
     * @return array{txn_id:int,duplicate:bool,allocation?:array}
     */
    public static function post(array $p): array
    {
        $db = Db::i();
        if ($p['amount_minor'] <= 0) throw new \InvalidArgumentException('Amount must be positive');
        return $db->tx(function () use ($db, $p) {
            $g = $db->one('SELECT currency,timezone FROM `groups` WHERE id=?', [$p['group_id']]);
            $m = $db->one('SELECT id FROM group_memberships WHERE id=? AND group_id=?', [$p['membership_id'], $p['group_id']]);
            if (!$m) throw new \InvalidArgumentException('Member does not belong to this group');
            for ($try = 0; ; $try++) {
                $receipt = 'AFR-' . Clock::now()->format('ymd') . '-' . substr(self::newRef(''), 0, 6);
                try {
                    $tid = $db->insert('INSERT INTO payment_transactions (group_id,membership_id,request_id,provider,provider_ref,source,method,amount_minor,currency,status,receipt_no,paid_at,recorded_by,note,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                        [$p['group_id'], $p['membership_id'], $p['request_id'], $p['provider'], $p['provider_ref'], $p['source'], $p['method'], $p['amount_minor'], $g['currency'], 'posted', $receipt, Clock::nowSql(), $p['recorded_by'], $p['note'], Clock::nowSql()]);
                    break;
                } catch (\Throwable $e) {
                    if (!Db::isDuplicate($e)) throw $e;
                    if (str_contains($e->getMessage(), 'uq_txn_ref')) {
                        $ex = $db->one('SELECT id FROM payment_transactions WHERE group_id=? AND provider=? AND provider_ref=?', [$p['group_id'], $p['provider'], $p['provider_ref']]);
                        return ['txn_id' => (int)$ex['id'], 'duplicate' => true];
                    }
                    if ($try > 5) throw $e;
                }
            }
            $alloc = AllocationService::allocatePayment($tid, $p['group_id'], $p['membership_id'], $p['amount_minor'], Clock::today($g['timezone']), $p['recorded_by']);
            Audit::log('payment.posted', $p['group_id'], 'payment', $tid, ['amount_minor' => $p['amount_minor'], 'source' => $p['source'], 'ref' => $p['provider_ref']], $p['recorded_by']);
            return ['txn_id' => $tid, 'duplicate' => false, 'allocation' => $alloc];
        });
    }

    /** Notifications for a freshly posted payment (outside the money transaction on purpose). */
    public static function afterPosted(int $txnId): void
    {
        $db = Db::i();
        $t = $db->one('SELECT t.*, m.user_id, g.name gname, g.currency FROM payment_transactions t JOIN group_memberships m ON m.id=t.membership_id JOIN `groups` g ON g.id=t.group_id WHERE t.id=?', [$txnId]);
        if (!$t) return;
        $g = $db->one('SELECT timezone FROM `groups` WHERE id=?', [$t['group_id']]);
        $bal = ContributionEngine::balance((int)$t['membership_id'], Clock::today($g['timezone']));
        Notifications::send((int)$t['user_id'], (int)$t['group_id'], 'payment', 'Payment received',
            sprintf('We received %s for %s (receipt %s). Your outstanding contributions are now %s.', Money::fmt((int)$t['amount_minor'], $t['currency']), $t['gname'], $t['receipt_no'], Money::fmt($bal['outstanding_total'], $t['currency'])),
            '/g/' . $t['group_id'] . '/receipts/' . $t['id'], 'pay-ok:' . $txnId);
    }

    private static function notifyFailure(array $req, string $reason): void
    {
        $db = Db::i();
        $g = $db->one('SELECT name,currency FROM `groups` WHERE id=?', [$req['group_id']]);
        Notifications::send((int)$req['user_id'], (int)$req['group_id'], 'payment', 'Payment not completed',
            sprintf('Your payment of %s to %s was not completed (%s). Nothing was charged to your contributions. You can try again any time.', Money::fmt((int)$req['amount_minor'], $g['currency']), $g['name'], $reason ?: 'declined'),
            '/g/' . $req['group_id'] . '/pay', 'pay-fail:' . $req['id']);
    }

    /** Treasurer/chair records money received outside the provider flow (cash, bank, Paybill statement). Clearly marked source=manual. */
    public static function recordManual(int $groupId, int $membershipId, int $amountMinor, string $method, string $reference, string $note, int $actor, ?int $requestId = null): array
    {
        $reference = trim($reference);
        if ($amountMinor <= 0) throw new \InvalidArgumentException('Enter an amount greater than zero.');
        if (!in_array($method, ['cash', 'bank', 'mpesa_paybill', 'mpesa_till', 'other'], true)) throw new \InvalidArgumentException('Choose a payment method.');
        if ($reference === '' || strlen($reference) > 60) throw new \InvalidArgumentException('A receipt or reference number is required.');
        $provider = str_starts_with($method, 'mpesa') ? 'mpesa' : 'manual';
        $db = Db::i();
        $out = $db->tx(function () use ($db, $groupId, $membershipId, $amountMinor, $method, $reference, $note, $actor, $requestId, $provider) {
            if ($requestId) {
                $r = $db->one('SELECT * FROM payment_requests WHERE id=? AND group_id=? FOR UPDATE', [$requestId, $groupId]);
                if (!$r || $r['status'] === 'succeeded') throw new \InvalidArgumentException('This payment request is not awaiting reconciliation.');
                $membershipId = (int)$r['membership_id'];
            }
            $p = self::post(['group_id' => $groupId, 'membership_id' => $membershipId, 'amount_minor' => $amountMinor, 'provider' => $provider,
                'provider_ref' => $reference, 'source' => 'manual', 'method' => $method, 'request_id' => $requestId, 'recorded_by' => $actor, 'note' => mb_substr($note, 0, 250) ?: null]);
            if ($requestId && !$p['duplicate']) {
                $db->exec("UPDATE payment_requests SET status='succeeded', result_code='MANUAL', result_desc='Reconciled manually', provider_receipt=?, txn_id=?, updated_at=? WHERE id=?", [$reference, $p['txn_id'], Clock::nowSql(), $requestId]);
            }
            return $p;
        });
        if ($out['duplicate']) throw new \InvalidArgumentException('That reference has already been recorded for this group.');
        self::afterPosted($out['txn_id']);
        return $out;
    }

    // ------------------------------------------------------------------ status checks / reversal

    /** Ask the provider about a request that has no final answer. Never credits money without a receipt. */
    public static function checkStatus(int $requestId): string
    {
        $db = Db::i();
        $req = $db->one('SELECT * FROM payment_requests WHERE id=?', [$requestId]);
        if (!$req || !in_array($req['status'], ['pending', 'unknown'], true) || !$req['provider_request_id']) return $req['status'] ?? 'missing';
        $q = self::driver()->query($req['provider_request_id']);
        $db->insert('INSERT INTO payment_attempts (request_id,kind,ok,summary,created_at) VALUES (?,?,?,?,?)', [$requestId, 'query', (int)($q['status'] !== 'error'), $q['status'] . ': ' . mb_substr($q['desc'], 0, 300), Clock::nowSql()]);
        if ($q['status'] === 'failed') {
            $db->exec("UPDATE payment_requests SET status='failed', result_code=?, result_desc=?, updated_at=? WHERE id=? AND status IN ('pending','unknown')", [$q['code'], mb_substr($q['desc'], 0, 250), Clock::nowSql(), $requestId]);
            self::notifyFailure($req, $q['desc']);
            return 'failed';
        }
        if ($q['status'] === 'success') {
            // The query API carries no receipt number, so we cannot safely credit here (a later callback would double-credit).
            self::flag($req, 'QUERY_SUCCESS_NO_RECEIPT', 'Provider confirms success but the receipt callback has not arrived. Match it to the M-PESA statement and reconcile.', 'query_success_no_receipt');
            return 'unknown';
        }
        return $req['status'];
    }

    /** Worker: resolve requests that never got a final answer. */
    public static function pollOpenRequests(): array
    {
        $db = Db::i();
        $stats = ['checked' => 0, 'stale_marked' => 0];
        $db->exec("UPDATE payment_requests SET status='unknown', result_code='NO_PROVIDER_ACK', result_desc='Request was created but the provider never acknowledged it', updated_at=? WHERE status='created' AND created_at<?",
            [Clock::nowSql(), Clock::now()->modify('-2 minutes')->format('Y-m-d H:i:s')]);
        foreach ($db->all("SELECT id FROM payment_requests WHERE status='pending' AND provider_request_id IS NOT NULL AND created_at<? AND created_at>? LIMIT 100",
            [Clock::now()->modify('-2 minutes')->format('Y-m-d H:i:s'), Clock::now()->modify('-2 days')->format('Y-m-d H:i:s')]) as $r) {
            self::checkStatus((int)$r['id']);
            $stats['checked']++;
        }
        return $stats;
    }

    public static function requestReversal(int $txnId, int $groupId, string $reason, int $userId): array
    {
        $db = Db::i();
        $t = $db->one('SELECT * FROM payment_transactions WHERE id=? AND group_id=?', [$txnId, $groupId]);
        if (!$t || $t['status'] !== 'posted') return ['ok' => false, 'error' => 'Only a posted payment can be reversed.'];
        if (trim($reason) === '') return ['ok' => false, 'error' => 'A reason is required.'];
        try {
            $id = $db->insert('INSERT INTO payment_reversals (txn_id,reason,requested_by,created_at) VALUES (?,?,?,?)', [$txnId, mb_substr(trim($reason), 0, 250), $userId, Clock::nowSql()]);
        } catch (\Throwable $e) {
            if (Db::isDuplicate($e)) return ['ok' => false, 'error' => 'A reversal has already been requested for this payment.'];
            throw $e;
        }
        Audit::log('payment.reversal_requested', $groupId, 'payment', $txnId, ['reason' => $reason], $userId);
        if (!(int)GroupService::settings($groupId)['dual_control_reversals']) return self::decideReversal($id, $groupId, $userId, true);
        Notifications::toRoles($groupId, ['chairperson', 'treasurer'], 'payment', 'Payment reversal awaiting approval', 'Receipt ' . $t['receipt_no'] . ': ' . $reason, '/g/' . $groupId . '/payments', 'rev-req:' . $id);
        return ['ok' => true, 'pending_approval' => true];
    }

    public static function decideReversal(int $reversalId, int $groupId, int $approverUserId, bool $approve): array
    {
        $db = Db::i();
        $r = $db->one('SELECT r.*, t.group_id FROM payment_reversals r JOIN payment_transactions t ON t.id=r.txn_id WHERE r.id=? AND t.group_id=?', [$reversalId, $groupId]);
        if (!$r || $r['status'] !== 'requested') return ['ok' => false, 'error' => 'Reversal is not awaiting a decision.'];
        if (GroupService::settings($groupId)['dual_control_reversals'] && (int)$r['requested_by'] === $approverUserId) {
            return ['ok' => false, 'error' => 'Dual control: someone other than the requester must approve a reversal.'];
        }
        if (!$approve) {
            $db->exec("UPDATE payment_reversals SET status='rejected', approved_by=?, decided_at=? WHERE id=?", [$approverUserId, Clock::nowSql(), $reversalId]);
            Audit::log('payment.reversal_rejected', $groupId, 'payment', (int)$r['txn_id'], [], $approverUserId);
            return ['ok' => true];
        }
        $db->tx(function () use ($db, $r, $reversalId, $approverUserId) {
            AllocationService::reverse((int)$r['txn_id'], $r['reason'], (int)$r['requested_by'], $approverUserId);
            $db->exec("UPDATE payment_reversals SET status='approved', approved_by=?, decided_at=? WHERE id=?", [$approverUserId, Clock::nowSql(), $reversalId]);
        });
        $t = $db->one('SELECT t.receipt_no, t.amount_minor, t.currency, m.user_id FROM payment_transactions t JOIN group_memberships m ON m.id=t.membership_id WHERE t.id=?', [$r['txn_id']]);
        Notifications::send((int)$t['user_id'], $groupId, 'payment', 'Payment reversed', 'Receipt ' . $t['receipt_no'] . ' for ' . Money::fmt((int)$t['amount_minor'], $t['currency']) . ' was reversed: ' . $r['reason'], '/g/' . $groupId . '/me', 'rev-done:' . $reversalId);
        return ['ok' => true];
    }

    // ------------------------------------------------------------------ C2B (Paybill) confirmations

    /** Safaricom C2B confirmation. Parked for treasurer review unless MPESA_C2B_AUTOPOST=true (no independent verification API exists). */
    public static function handleC2bConfirmation(array $p, string $ip): array
    {
        $ack = ['http' => 200, 'body' => ['ResultCode' => 0, 'ResultDesc' => 'Accepted']];
        $trans = (string)($p['TransID'] ?? '');
        if ($trans === '' || strlen($trans) > 60 || !isset($p['TransAmount'])) return ['http' => 400, 'body' => ['ResultCode' => 1, 'ResultDesc' => 'Malformed']];
        $db = Db::i();
        $member = $db->one("SELECT m.id, m.group_id FROM group_memberships m JOIN `groups` g ON g.id=m.group_id WHERE m.member_code=? AND m.status='active' AND g.status='active'", [strtoupper(trim((string)($p['BillRefNumber'] ?? '')))]);
        try {
            $eid = $db->insert('INSERT INTO payment_provider_events (provider,event_type,event_key,payload,source_ip,received_at,outcome,group_id) VALUES (?,?,?,?,?,?,?,?)',
                ['mpesa', 'c2b_confirmation', $trans, json_encode($p), $ip, Clock::nowSql(), $member ? 'c2b_pending_review' : 'c2b_unmatched', $member['group_id'] ?? null]);
        } catch (\Throwable $e) {
            if (!Db::isDuplicate($e)) throw $e;
            $db->exec("UPDATE payment_provider_events SET duplicate_count=duplicate_count+1 WHERE provider='mpesa' AND event_type='c2b_confirmation' AND event_key=?", [$trans]);
            return $ack;
        }
        if ($member && Env::bool('MPESA_C2B_AUTOPOST', false)) {
            self::acceptC2b($eid, (int)$member['group_id'], 0);
        } elseif ($member) {
            Notifications::toRoles((int)$member['group_id'], ['treasurer', 'chairperson'], 'payment', 'Paybill payment awaiting review', 'M-PESA ' . $trans . ' for ' . Money::fmt((int)Money::parse(sprintf('%.2F', (float)$p['TransAmount']))) . ' needs approval.', '/g/' . $member['group_id'] . '/reconcile', 'c2b:' . $eid);
        }
        return $ack;
    }

    public static function acceptC2b(int $eventId, int $groupId, int $actor): array
    {
        $db = Db::i();
        $ev = $db->one("SELECT * FROM payment_provider_events WHERE id=? AND event_type='c2b_confirmation' AND group_id=?", [$eventId, $groupId]);
        if (!$ev || $ev['outcome'] !== 'c2b_pending_review') throw new \InvalidArgumentException('Event is not awaiting review.');
        $p = json_decode($ev['payload'], true);
        $m = $db->one("SELECT id FROM group_memberships WHERE member_code=? AND group_id=?", [strtoupper(trim((string)($p['BillRefNumber'] ?? ''))), $groupId]);
        if (!$m) throw new \InvalidArgumentException('Member reference no longer matches.');
        $amount = Money::parse(sprintf('%.2F', (float)$p['TransAmount']));
        $out = self::post(['group_id' => $groupId, 'membership_id' => (int)$m['id'], 'amount_minor' => (int)$amount, 'provider' => 'mpesa', 'provider_ref' => $ev['event_key'],
            'source' => $actor ? 'manual' : 'provider_verified', 'method' => 'mpesa_paybill', 'request_id' => null, 'recorded_by' => $actor ?: null, 'note' => 'Accepted from Paybill confirmation']);
        $db->exec("UPDATE payment_provider_events SET outcome='c2b_posted', processed_at=? WHERE id=?", [Clock::nowSql(), $eventId]);
        if (!$out['duplicate']) self::afterPosted($out['txn_id']);
        return $out;
    }

    // ------------------------------------------------------------------ reconciliation view

    public static function reconciliation(int $groupId): array
    {
        $db = Db::i();
        $stale = Clock::now()->modify('-5 minutes')->format('Y-m-d H:i:s');
        $out = [
            'unresolved' => $db->all("SELECT r.*, u.full_name, m.member_code FROM payment_requests r JOIN group_memberships m ON m.id=r.membership_id JOIN users u ON u.id=m.user_id
                                      WHERE r.group_id=? AND ((r.status IN ('created','pending') AND r.created_at<?) OR r.status='unknown') ORDER BY r.id DESC LIMIT 100", [$groupId, $stale]),
            'failed' => $db->all("SELECT r.*, u.full_name, m.member_code FROM payment_requests r JOIN group_memberships m ON m.id=r.membership_id JOIN users u ON u.id=m.user_id
                                  WHERE r.group_id=? AND r.status='failed' AND r.created_at>? ORDER BY r.id DESC LIMIT 50", [$groupId, Clock::now()->modify('-30 days')->format('Y-m-d H:i:s')]),
            'duplicates' => $db->all('SELECT id,provider,event_type,event_key,duplicate_count,received_at,outcome FROM payment_provider_events WHERE group_id=? AND duplicate_count>0 ORDER BY id DESC LIMIT 50', [$groupId]),
            'c2b_pending' => $db->all("SELECT * FROM payment_provider_events WHERE group_id=? AND outcome='c2b_pending_review' ORDER BY id DESC LIMIT 50", [$groupId]),
            'ledger_unbalanced' => Ledger::unbalancedJournals($groupId),
        ];
        // Internal consistency: obligation.paid_minor must equal live allocations; group funds must equal posted payments minus paid expenses.
        $out['paid_mismatch'] = $db->all(
            "SELECT o.id, o.paid_minor, COALESCE(SUM(a.amount_minor),0) alloc FROM contribution_obligations o
             LEFT JOIN payment_allocations a ON a.obligation_id=o.id AND a.reversed_at IS NULL
             WHERE o.group_id=? GROUP BY o.id HAVING o.paid_minor<>alloc LIMIT 50", [$groupId]);
        $posted = (int)$db->val("SELECT COALESCE(SUM(amount_minor),0) FROM payment_transactions WHERE group_id=? AND status='posted'", [$groupId]);
        $paidExp = (int)$db->val("SELECT COALESCE(SUM(amount_minor),0) FROM group_expenses WHERE group_id=? AND status='paid'", [$groupId]);
        $out['funds_ledger'] = Ledger::balance($groupId, '1000');
        $out['funds_expected'] = $posted - $paidExp;
        return $out;
    }
}
