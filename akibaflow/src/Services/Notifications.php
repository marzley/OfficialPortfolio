<?php
declare(strict_types=1);
namespace Akiba\Services;

use Akiba\Core\{Clock, Db, Env};

/**
 * Queue-backed notifications. In-app messages are written immediately; email/SMS go through
 * notification_jobs with retries and per-attempt delivery logs. Dedupe keys make every send idempotent.
 */
final class Notifications
{
    /** Categories members may switch off. Everything else (payments, security, membership) is essential. */
    private const OPTIONAL = ['reminders', 'announcements'];

    public static function send(int $userId, ?int $groupId, string $category, string $subject, string $body, ?string $link = null, ?string $dedupe = null, array $channels = ['in_app', 'email', 'sms']): int
    {
        $db = Db::i();
        $user = $db->one("SELECT id,email,phone FROM users WHERE id=? AND status='active'", [$userId]);
        if (!$user) return 0;
        $dedupe ??= $category . ':' . bin2hex(random_bytes(8));
        $created = 0;
        foreach ($channels as $ch) {
            if ($ch === 'email' && !$user['email']) continue;
            if ($ch === 'sms' && !$user['phone']) continue;
            if (in_array($category, self::OPTIONAL, true) && $ch !== 'in_app') {
                $pref = $db->val('SELECT enabled FROM notification_preferences WHERE user_id=? AND channel=? AND category=?', [$userId, $ch, $category]);
                if ($pref !== null && !(int)$pref) continue;
            }
            try {
                $jid = $db->insert('INSERT INTO notification_jobs (dedupe_key,user_id,group_id,channel,category,subject,body,link,status,next_attempt_at,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                    [$dedupe, $userId, $groupId, $ch, $category, mb_substr($subject, 0, 190), $body, $link, $ch === 'in_app' ? 'sent' : 'pending', Clock::nowSql(), Clock::nowSql()]);
            } catch (\Throwable $e) {
                if (Db::isDuplicate($e)) continue; // already queued/sent for this event
                throw $e;
            }
            $created++;
            if ($ch === 'in_app') {
                $db->exec('UPDATE notification_jobs SET sent_at=?, attempts=1 WHERE id=?', [Clock::nowSql(), $jid]);
                $db->insert('INSERT INTO notifications (user_id,group_id,category,title,body,link,created_at) VALUES (?,?,?,?,?,?,?)', [$userId, $groupId, $category, $subject, $body, $link, Clock::nowSql()]);
            }
        }
        return $created;
    }

    /** Send to every active member holding one of $roles. */
    public static function toRoles(int $groupId, array $roles, string $category, string $subject, string $body, ?string $link, string $dedupe): void
    {
        $in = implode(',', array_fill(0, count($roles), '?'));
        foreach (Db::i()->all("SELECT user_id FROM group_memberships WHERE group_id=? AND status='active' AND role IN ($in)", [$groupId, ...$roles]) as $r) {
            self::send((int)$r['user_id'], $groupId, $category, $subject, $body, $link, $dedupe . ':u' . $r['user_id']);
        }
    }

    /** Worker entry: deliver due email/SMS jobs. @return array{sent:int,failed:int,skipped:int} */
    public static function process(int $limit = 100): array
    {
        $db = Db::i();
        $stats = ['sent' => 0, 'failed' => 0, 'skipped' => 0];
        $jobs = $db->all("SELECT j.*, u.email, u.phone, u.full_name FROM notification_jobs j JOIN users u ON u.id=j.user_id
                          WHERE j.status='pending' AND j.next_attempt_at<=? ORDER BY j.id LIMIT " . (int)$limit, [Clock::nowSql()]);
        foreach ($jobs as $j) {
            // claim the job so two workers don't double-send
            if (!$db->exec("UPDATE notification_jobs SET attempts=attempts+1 WHERE id=? AND status='pending' AND attempts=?", [$j['id'], $j['attempts']])) continue;
            $attempt = (int)$j['attempts'] + 1;
            [$state, $detail] = match ($j['channel']) {
                'email' => self::deliverEmail($j),
                'sms' => self::deliverSms($j),
                default => ['sent', 'in-app'],
            };
            $db->insert('INSERT INTO notification_deliveries (job_id,attempt_no,status,detail,created_at) VALUES (?,?,?,?,?)', [$j['id'], $attempt, $state, mb_substr($detail, 0, 250), Clock::nowSql()]);
            if ($state === 'sent') {
                $db->exec("UPDATE notification_jobs SET status='sent', sent_at=?, last_error=NULL WHERE id=?", [Clock::nowSql(), $j['id']]);
                $stats['sent']++;
            } elseif ($state === 'skipped') {
                $db->exec("UPDATE notification_jobs SET status='skipped', last_error=? WHERE id=?", [mb_substr($detail, 0, 250), $j['id']]);
                $stats['skipped']++;
            } else {
                $final = $attempt >= (int)$j['max_attempts'];
                $db->exec('UPDATE notification_jobs SET status=?, last_error=?, next_attempt_at=? WHERE id=?',
                    [$final ? 'failed' : 'pending', mb_substr($detail, 0, 250), Clock::now()->modify('+' . (2 ** $attempt) . ' minutes')->format('Y-m-d H:i:s'), $j['id']]);
                $stats['failed']++;
            }
        }
        return $stats;
    }

    private static function deliverEmail(array $j): array
    {
        $driver = Env::get('MAIL_DRIVER', 'log');
        $from = Env::get('MAIL_FROM', 'no-reply@akibaflow.example');
        $subject = preg_replace('/[\r\n]+/', ' ', $j['subject']);
        if ($driver === 'mail') {
            $ok = @mail($j['email'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $j['body'] . ($j['link'] ? "\n\n" . rtrim((string)Env::get('APP_URL', ''), '/') . $j['link'] : ''),
                "From: AkibaFlow <$from>\r\nContent-Type: text/plain; charset=UTF-8");
            return $ok ? ['sent', 'handed to local MTA via mail()'] : ['failed', 'mail() returned false'];
        }
        $dir = AF_ROOT . '/storage/mail';
        if (!is_dir($dir)) @mkdir($dir, 0775, true);
        file_put_contents($dir . '/outbox.log', sprintf("[%s] To: %s | %s\n%s\n---\n", Clock::nowSql(), $j['email'], $subject, $j['body']), FILE_APPEND | LOCK_EX);
        return ['sent', 'MAIL_DRIVER=log: written to storage/mail/outbox.log (NOT transmitted)'];
    }

    private static function deliverSms(array $j): array
    {
        if (Env::get('SMS_DRIVER', 'none') !== 'africastalking' || !Env::get('AT_API_KEY') || !Env::get('AT_USERNAME')) {
            return ['skipped', 'SMS provider not configured'];
        }
        $user = Env::get('AT_USERNAME');
        $post = ['username' => $user, 'to' => $j['phone'], 'message' => mb_substr($j['subject'] . ': ' . $j['body'], 0, 450)];
        if (Env::get('AT_SENDER_ID')) $post['from'] = Env::get('AT_SENDER_ID');
        $host = $user === 'sandbox' ? 'api.sandbox.africastalking.com' : 'api.africastalking.com';
        $ch = curl_init("https://$host/version1/messaging");
        curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => http_build_query($post), CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
            CURLOPT_HTTPHEADER => ['apiKey: ' . Env::get('AT_API_KEY'), 'Accept: application/json']]);
        $out = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        if ($out === false) return ['failed', 'transport error: ' . $err];
        return $code >= 200 && $code < 300 ? ['sent', 'accepted by provider (HTTP ' . $code . ')'] : ['failed', 'provider HTTP ' . $code];
    }
}
