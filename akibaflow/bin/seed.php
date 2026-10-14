<?php
declare(strict_types=1);
// DEVELOPMENT SEED — creates clearly-labelled TEST DATA through the real services (so every balance is derived
// from real obligation/payment rows). Refuses to run in production.  Usage: php bin/seed.php
require __DIR__ . '/../src/bootstrap.php';

use Akiba\Core\{Clock, Db, Env};
use Akiba\Services\{AllocationService, ContributionEngine, ExpenseService, GroupService, PaymentService, PlanService, ReminderService};

if (Env::isProduction()) { fwrite(STDERR, "Refusing to seed in production.\n"); exit(1); }
$db = Db::i();
if ($db->val("SELECT 1 FROM users WHERE email='admin@akibaflow.test'")) { echo "Seed data already present.\n"; exit(0); }

$pw = password_hash('Passw0rd-Demo1', PASSWORD_DEFAULT);
$mk = fn(string $name, string $email, string $phone, bool $admin = false) => $db->insert(
    'INSERT INTO users (email,phone,full_name,password_hash,is_super_admin,email_verified_at,created_at) VALUES (?,?,?,?,?,?,?)', [$email, $phone, $name, $pw, (int)$admin, Clock::nowSql(), Clock::nowSql()]);

$admin = $mk('Platform Admin (TEST)', 'admin@akibaflow.test', '+254700000001', true);
$chair = $mk('Wanjiku Mwangi (TEST)', 'chair@akibaflow.test', '+254700000002');
$treas = $mk('Otieno Odhiambo (TEST)', 'treasurer@akibaflow.test', '+254700000003');
$a = $mk('Amina Hassan (TEST)', 'amina@akibaflow.test', '+254700000004');
$b = $mk('Brian Kiptoo (TEST)', 'brian@akibaflow.test', '+254700000005');
$c = $mk('Cecilia Nduta (TEST)', 'cecilia@akibaflow.test', '+254700000006');
$d = $mk('Daniel Mutua (TEST)', 'daniel@akibaflow.test', '+254700000007');

$start = (new DateTimeImmutable('today', new DateTimeZone('Africa/Nairobi')))->modify('-9 days')->format('Y-m-d');
Clock::freeze($start . ' 06:00:00');
$r = GroupService::create($chair, ['name' => 'DEMO Umoja Welfare Group (TEST DATA)', 'purpose' => 'Welfare & emergency fund', 'description' => 'Seeded demo group — not real financial data.', 'contact_email' => 'chair@akibaflow.test']);
$gid = $r['group_id'];
$mem = [];
foreach (['treas' => [$treas, 'treasurer'], 'a' => [$a, 'member'], 'b' => [$b, 'member'], 'c' => [$c, 'member'], 'd' => [$d, 'member']] as $k => [$uid, $role]) $mem[$k] = GroupService::addMember($gid, $uid, $role, 'active', $start);
$chairM = (int)$db->val('SELECT id FROM group_memberships WHERE group_id=? AND user_id=?', [$gid, $chair]);
$plan = PlanService::create($gid, $chair, ['name' => 'Daily savings', 'amount' => '100', 'frequency' => 'daily', 'start_date' => $start, 'lookahead_days' => 1, 'description' => 'KSh 100 every day']);
PlanService::create($gid, $chair, ['name' => 'Monthly welfare', 'amount' => '500', 'frequency' => 'monthly', 'month_day' => 5, 'start_date' => $start, 'lookahead_days' => 31]);

$pay = function (int $m, int $kes, string $ref) use ($gid, $chair) {
    $p = PaymentService::post(['group_id' => $gid, 'membership_id' => $m, 'amount_minor' => $kes * 100, 'provider' => 'sandbox', 'provider_ref' => $ref, 'source' => 'provider_verified',
        'method' => 'mpesa_stk', 'request_id' => null, 'recorded_by' => null, 'note' => 'seed']);
    PaymentService::afterPosted($p['txn_id']);
};
for ($i = 0; $i < 10; $i++) {
    $day = (new DateTimeImmutable($start))->modify("+$i days")->format('Y-m-d');
    Clock::freeze($day . ' 09:00:00');
    ContributionEngine::generate($gid);
    ReminderService::run($gid);
    $pay($mem['a'], 100, "SEEDA$i");                              // Amina pays every day
    if ($i === 5) $pay($mem['b'], 400, 'SEEDB1');                  // Brian misses days 0-3 then pays 4 days at once (KSh 400)
    if ($i >= 6 && $i <= 7) $pay($mem['b'], 100, "SEEDB$i");
    if ($i === 3) $pay($mem['d'], 500, 'SEEDD1');                  // Daniel pays ahead / overpays
    if ($i === 0) $pay($mem['treas'], 100, 'SEEDT0');
    // Cecilia never pays -> growing arrears
}
Clock::freeze(null);
ContributionEngine::generate($gid);

$ex = ExpenseService::create($gid, $treas, ['category' => 'Welfare / Support', 'description' => 'Hospital visit support (TEST)', 'amount' => '300', 'payee' => 'Nairobi Hospital', 'expense_date' => date('Y-m-d')]);
ExpenseService::decide($ex['id'], $gid, $chair, 'chairperson', true, 'Approved (seed)');
ExpenseService::pay($ex['id'], $gid, $treas, 'mpesa', 'SEEDEXP1');
$db->insert('INSERT INTO savings_goals (group_id,name,description,target_minor,plan_id,created_by,created_at) VALUES (?,?,?,?,?,?,?)', [$gid, 'Emergency fund', 'Seeded goal', 5000000, $plan['plan_id'], $chair, Clock::nowSql()]);
$db->insert('INSERT INTO announcements (group_id,title,body,created_by,created_at) VALUES (?,?,?,?,?)', [$gid, 'Welcome to AkibaFlow (TEST)', 'This is seeded demo data.', $chair, Clock::nowSql()]);
echo "Seeded. Sign in with any of these (password: Passw0rd-Demo1):\n  admin@akibaflow.test (platform admin)\n  chair@akibaflow.test (chairperson)\n  treasurer@akibaflow.test\n  amina@ / brian@ / cecilia@ / daniel@akibaflow.test (members)\n";
