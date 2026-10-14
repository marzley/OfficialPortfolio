<?php
declare(strict_types=1);
// Front controller. Run locally with:  php -S localhost:8080 -t public public/router.php
require __DIR__ . '/../src/bootstrap.php';

use Akiba\Core\{Auth, Env, Http, HttpException, Router, Session, View};
use Akiba\Http\{AccountController as Acc, AdminController as Adm, ApiController as Api, AuthController as Au, CallbackController as Cb,
    GroupController as Gr, MemberController as Me, SandboxController as Sb};

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');
header("Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'");
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
if (Env::isProduction()) header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

$path = rtrim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/', '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$r = new Router();
// public / auth
$r->get('/', [Au::class, 'landing']);
$r->get('/login', [Au::class, 'loginForm']);       $r->post('/login', [Au::class, 'login']);
$r->get('/register', [Au::class, 'registerForm']); $r->post('/register', [Au::class, 'register']);
$r->post('/logout', [Au::class, 'logout']);
$r->get('/forgot', [Au::class, 'forgotForm']);     $r->post('/forgot', [Au::class, 'forgot']);
$r->get('/reset/{token}', [Au::class, 'resetForm']); $r->post('/reset/{token}', [Au::class, 'reset']);
$r->get('/verify/{token}', [Au::class, 'verify']);
// account
$r->get('/groups', [Acc::class, 'groups']);
$r->get('/groups/new', [Acc::class, 'newGroupForm']); $r->post('/groups/new', [Acc::class, 'newGroup']);
$r->get('/account', [Acc::class, 'account']);
$r->post('/account/profile', [Acc::class, 'profile']);
$r->post('/account/password', [Acc::class, 'password']);
$r->post('/account/prefs', [Acc::class, 'prefs']);
$r->post('/account/sessions/{id}/revoke', [Acc::class, 'revokeSession']);
$r->get('/notifications', [Acc::class, 'notifications']); $r->post('/notifications/read', [Acc::class, 'markRead']);
$r->get('/invites/{token}', [Acc::class, 'invite']); $r->post('/invites/{token}', [Acc::class, 'acceptInvite']);
// member area
$r->get('/g/{gid}', [Me::class, 'dashboard']);
$r->get('/g/{gid}/pay', [Me::class, 'payForm']);        $r->post('/g/{gid}/pay', [Me::class, 'pay']);
$r->get('/g/{gid}/pay/{ref}', [Me::class, 'payStatus']);
$r->post('/g/{gid}/credit/apply', [Me::class, 'applyCredit']);
$r->get('/g/{gid}/history', [Me::class, 'history']);
$r->get('/g/{gid}/calendar', [Me::class, 'calendar']);
$r->get('/g/{gid}/receipts', [Me::class, 'receipts']);
$r->get('/g/{gid}/receipts/{id}', [Me::class, 'receipt']);
$r->get('/g/{gid}/statement', [Me::class, 'statement']);
$r->get('/g/{gid}/goals', [Me::class, 'goals']);        $r->post('/g/{gid}/goals', [Gr::class, 'saveGoal']);
$r->post('/g/{gid}/goals/{id}/allocate', [Gr::class, 'allocateGoal']);
$r->get('/g/{gid}/announcements', [Me::class, 'announcements']); $r->post('/g/{gid}/announcements', [Gr::class, 'announce']);
// officers
$r->get('/g/{gid}/overview', [Gr::class, 'overview']);
$r->get('/g/{gid}/members', [Gr::class, 'members']);
$r->post('/g/{gid}/members/invite', [Gr::class, 'invite']);
$r->post('/g/{gid}/members/{id}/action', [Gr::class, 'memberAction']);
$r->get('/g/{gid}/members/{id}', [Gr::class, 'memberDetail']);
$r->get('/g/{gid}/plans', [Gr::class, 'plans']);        $r->post('/g/{gid}/plans', [Gr::class, 'createPlan']);
$r->get('/g/{gid}/plans/{id}', [Gr::class, 'planDetail']);
$r->post('/g/{gid}/plans/{id}/version', [Gr::class, 'planVersion']);
$r->post('/g/{gid}/plans/{id}/status', [Gr::class, 'planStatus']);
$r->get('/g/{gid}/arrears', [Gr::class, 'arrears']);
$r->post('/g/{gid}/obligations/{id}/waive', [Gr::class, 'waive']);
$r->get('/g/{gid}/payments', [Gr::class, 'payments']);
$r->post('/g/{gid}/payments/manual', [Gr::class, 'manualPayment']);
$r->post('/g/{gid}/payments/{id}/reverse', [Gr::class, 'requestReversal']);
$r->post('/g/{gid}/reversals/{id}/decide', [Gr::class, 'decideReversal']);
$r->get('/g/{gid}/reconcile', [Gr::class, 'reconcile']);
$r->post('/g/{gid}/reconcile/check/{id}', [Gr::class, 'recheck']);
$r->post('/g/{gid}/reconcile/resolve/{id}', [Gr::class, 'resolveRequest']);
$r->post('/g/{gid}/reconcile/c2b/{id}', [Gr::class, 'acceptC2b']);
$r->get('/g/{gid}/expenses', [Gr::class, 'expenses']); $r->post('/g/{gid}/expenses', [Gr::class, 'createExpense']);
$r->post('/g/{gid}/expenses/{id}/decide', [Gr::class, 'decideExpense']);
$r->post('/g/{gid}/expenses/{id}/pay', [Gr::class, 'payExpense']);
$r->post('/g/{gid}/expenses/{id}/reverse', [Gr::class, 'reverseExpense']);
$r->get('/g/{gid}/reports', [Gr::class, 'reports']);
$r->get('/g/{gid}/reports/{type}', [Gr::class, 'report']);
$r->get('/g/{gid}/audit', [Gr::class, 'audit']);
$r->get('/g/{gid}/settings', [Gr::class, 'settings']); $r->post('/g/{gid}/settings', [Gr::class, 'saveSettings']);
// JSON API
$r->get('/api/g/{gid}/me/outstanding-balance', [Api::class, 'balance']);
$r->get('/api/g/{gid}/me/contribution-calendar', [Api::class, 'calendar']);
$r->get('/api/g/{gid}/payments/{ref}', [Api::class, 'paymentStatus']);
$r->post('/api/g/{gid}/payments/initiate', [Api::class, 'initiate']);
$r->get('/api/g/{gid}/charts/collections', [Api::class, 'collections']);
// provider callbacks (no session, no CSRF — authenticated by secret path + verification)
$r->post('/callbacks/mpesa/stk/{secret}', [Cb::class, 'stk']);
$r->post('/callbacks/mpesa/c2b/{secret}', [Cb::class, 'c2b']);
// dev sandbox phone
$r->get('/sandbox/phone', [Sb::class, 'phone']); $r->post('/sandbox/phone', [Sb::class, 'respond']);
// platform admin
$r->get('/admin', [Adm::class, 'dashboard']);
$r->get('/admin/users', [Adm::class, 'users']);   $r->post('/admin/users/{id}/status', [Adm::class, 'userStatus']);
$r->get('/admin/groups', [Adm::class, 'groups']); $r->post('/admin/groups/{id}/status', [Adm::class, 'groupStatus']);
$r->get('/admin/integrations', [Adm::class, 'integrations']);
$r->post('/admin/integrations/test-mpesa', [Adm::class, 'testMpesa']);
$r->get('/admin/jobs', [Adm::class, 'jobs']);
$r->post('/admin/jobs/{id}/retry', [Adm::class, 'retryJob']);
$r->get('/admin/backups', [Adm::class, 'backups']);

$isCallback = str_starts_with($path, '/callbacks/');
try {
    if (!$isCallback) Session::start();
    $r->dispatch($method, $path);
} catch (HttpException $e) {
    $code = $e->getCode() ?: 500;
    http_response_code($code);
    if ($isCallback || Http::wantsJson()) Http::json(['error' => $e->getMessage()], $code);
    View::render('errors/error', ['code' => $code, 'message' => $e->getMessage(), 'title' => "Error $code"], Auth::user() ? 'app' : 'plain');
} catch (Throwable $e) {
    error_log('[akibaflow] ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    http_response_code(500);
    if ($isCallback || Http::wantsJson()) Http::json(['error' => 'Internal error'], 500);
    $detail = Env::isProduction() ? '' : $e->getMessage();
    View::render('errors/error', ['code' => 500, 'message' => 'Something went wrong on our side. Your money records were not changed by this error.' . ($detail ? " [$detail]" : ''), 'title' => 'Error'], 'plain');
}
