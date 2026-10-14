<?php
declare(strict_types=1);
namespace Akiba\Http;

use Akiba\Core\{Auth, Db, Env, Http, View};
use Akiba\Payments\SandboxDriver;

/** Development-only "phone" for answering sandbox STK prompts. 404 in production or when a real driver is configured. */
final class SandboxController extends Ctl
{
    private static function enabled(): void
    {
        if (Env::isProduction() || Env::get('PAYMENT_DRIVER', 'sandbox') !== 'sandbox') Http::abort(404);
    }

    public static function phone(): void
    {
        self::enabled();
        $u = Auth::require();
        $rows = Db::i()->all("SELECT s.*, r.ref, r.amount_minor, g.name gname, g.currency FROM sandbox_stk s JOIN payment_requests r ON r.provider_request_id=s.checkout_id JOIN `groups` g ON g.id=r.group_id
                              WHERE r.user_id=? ORDER BY s.created_at DESC LIMIT 10", [$u['id']]);
        View::render('account/sandbox', ['rows' => $rows, 'title' => 'Sandbox phone', 'user' => $u]);
    }

    public static function respond(): void
    {
        self::enabled();
        $u = Auth::require();
        $c = Http::str('checkout');
        $own = Db::i()->val('SELECT 1 FROM payment_requests WHERE provider_request_id=? AND user_id=?', [$c, $u['id']]);
        if (!$own) Http::abort(404);
        $outcome = in_array(Http::str('outcome'), ['pay', 'cancel', 'insufficient'], true) ? Http::str('outcome') : 'cancel';
        $r = SandboxDriver::respond($c, $outcome);
        self::back('/sandbox/phone', $r['http'] === 200 ? 'success' : 'error', $r['http'] === 200 ? 'Sandbox response sent through the real callback handler.' : 'That prompt was already answered.');
    }
}
