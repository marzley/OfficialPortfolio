<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\ServiceLocation;
use App\Models\Tenant;
use App\Models\User;
use App\Support\Tenancy\TenantContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase1Test extends TestCase
{
    use RefreshDatabase;

    private function register(string $biz, string $email): array
    {
        $r = $this->postJson('/api/v1/auth/register', [
            'business_name' => $biz, 'name' => 'Owner', 'email' => $email,
            'password' => 'Str0ngPassw0rd', 'password_confirmation' => 'Str0ngPassw0rd',
        ])->assertCreated();
        return [$r->json('data.tenant.id'), $r->json('token')];
    }

    private function auth(string $token): array { return ['Authorization' => "Bearer $token"]; }

    private function staff(Tenant|int $tenant, string $role): User
    {
        $u = new User(['name' => $role, 'email' => $role.rand().'@x.test', 'password' => 'Str0ngPassw0rd']);
        $u->tenant_id = $tenant instanceof Tenant ? $tenant->id : $tenant;
        $u->role = $role;
        $u->save();
        return $u;
    }

    public function test_isp_registration_creates_tenant_and_owner_and_audit(): void
    {
        [$tid, $token] = $this->register('Acme Fibre', 'owner@acme.test');
        $this->assertDatabaseHas('tenants', ['id' => $tid, 'slug' => 'acme-fibre', 'status' => 'trial']);
        $this->assertDatabaseHas('users', ['email' => 'owner@acme.test', 'tenant_id' => $tid, 'role' => 'isp_owner']);
        $this->assertTrue(AuditLog::where('action', 'tenant.registered')->where('tenant_id', $tid)->exists());
        $this->getJson('/api/v1/auth/me', $this->auth($token))->assertOk()->assertJsonPath('data.role', 'isp_owner');
    }

    public function test_weak_password_and_duplicate_email_rejected(): void
    {
        $this->postJson('/api/v1/auth/register', ['business_name' => 'X', 'name' => 'a', 'email' => 'a@x.test', 'password' => 'short', 'password_confirmation' => 'short'])->assertStatus(422);
        $this->register('One', 'dup@x.test');
        $this->postJson('/api/v1/auth/register', ['business_name' => 'Two', 'name' => 'a', 'email' => 'dup@x.test', 'password' => 'Str0ngPassw0rd', 'password_confirmation' => 'Str0ngPassw0rd'])->assertStatus(422);
    }

    public function test_registration_cannot_escalate_role_via_mass_assignment(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'business_name' => 'Evil', 'name' => 'E', 'email' => 'e@x.test', 'role' => 'platform_super_admin', 'tenant_id' => 1,
            'password' => 'Str0ngPassw0rd', 'password_confirmation' => 'Str0ngPassw0rd',
        ])->assertCreated();
        $u = User::where('email', 'e@x.test')->first();
        $this->assertSame('isp_owner', $u->role);
        $this->assertNotNull($u->tenant_id);
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/api/v1/locations')->assertUnauthorized();
        $this->postJson('/api/v1/locations', [])->assertUnauthorized();
    }

    public function test_tenant_isolation_on_list_show_and_create(): void
    {
        [$ta, $a] = $this->register('ISP A', 'a@a.test');
        [$tb, $b] = $this->register('ISP B', 'b@b.test');

        $locA = $this->postJson('/api/v1/locations', ['name' => 'Murang\'a', 'code' => 'MUR'], $this->auth($a))->assertCreated()->json('data.id');
        $this->postJson('/api/v1/locations', ['name' => 'Thika', 'code' => 'THK', 'tenant_id' => $ta], $this->auth($b))->assertCreated();

        // B cannot see or fetch A's record, even by guessing the id
        $this->getJson("/api/v1/locations/$locA", $this->auth($b))->assertNotFound();
        $codes = collect($this->getJson('/api/v1/locations', $this->auth($b))->json('data'))->pluck('code')->all();
        $this->assertSame(['THK'], $codes);

        // body-supplied tenant_id is ignored: the Thika row belongs to B
        $this->assertSame($tb, ServiceLocation::withoutGlobalScopes()->where('code', 'THK')->value('tenant_id'));

        // same code in different tenants is allowed; same code in same tenant is not
        $this->postJson('/api/v1/locations', ['name' => 'x', 'code' => 'MUR'], $this->auth($b))->assertCreated();
        $this->postJson('/api/v1/locations', ['name' => 'x', 'code' => 'MUR'], $this->auth($a))->assertStatus(422);
    }

    public function test_tenant_scope_fails_closed_without_context(): void
    {
        $this->register('ISP A', 'a@a.test');
        $this->postJson('/api/v1/locations', [], []); // no-op; ensure app booted
        app(TenantContext::class)->set(null);
        $this->assertSame(0, ServiceLocation::count());
        $this->expectException(\LogicException::class);
        ServiceLocation::create(['name' => 'n', 'code' => 'c']);
    }

    public function test_role_permissions_enforced(): void
    {
        [$tid, $ownerToken] = $this->register('ISP A', 'a@a.test');
        $agent = $this->staff($tid, 'support_agent');
        $agentToken = $agent->createToken('t')->plainTextToken;

        $this->getJson('/api/v1/locations', $this->auth($agentToken))->assertOk();
        $this->postJson('/api/v1/locations', ['name' => 'n', 'code' => 'c'], $this->auth($agentToken))->assertForbidden();
        $this->postJson('/api/v1/staff', ['name' => 'n', 'email' => 'n@x.test', 'role' => 'isp_admin', 'password' => 'Str0ngPassw0rd'], $this->auth($agentToken))->assertForbidden();

        // owner can add staff, but cannot mint owners or platform admins
        $this->postJson('/api/v1/staff', ['name' => 'n', 'email' => 'n@x.test', 'role' => 'accountant', 'password' => 'Str0ngPassw0rd'], $this->auth($ownerToken))->assertCreated();
        $this->postJson('/api/v1/staff', ['name' => 'n', 'email' => 'p@x.test', 'role' => 'platform_super_admin', 'password' => 'Str0ngPassw0rd'], $this->auth($ownerToken))->assertStatus(422);
        $this->assertTrue(AuditLog::where('action', 'staff.created')->exists());
    }

    public function test_staff_list_never_leaks_other_tenants(): void
    {
        [, $a] = $this->register('ISP A', 'a@a.test');
        [, $b] = $this->register('ISP B', 'b@b.test');
        $emails = collect($this->getJson('/api/v1/staff', $this->auth($b))->json('data'))->pluck('email')->all();
        $this->assertSame(['b@b.test'], $emails);
    }

    public function test_platform_user_has_no_tenant_data_access(): void
    {
        $this->register('ISP A', 'a@a.test');
        $p = new User(['name' => 'P', 'email' => 'p@platform.test', 'password' => 'Str0ngPassw0rd']);
        $p->role = 'platform_super_admin';
        $p->save();
        $t = $p->createToken('t')->plainTextToken;
        $this->getJson('/api/v1/locations', $this->auth($t))->assertForbidden();
        $this->getJson('/api/v1/staff', $this->auth($t))->assertForbidden();
    }

    public function test_suspended_tenant_is_blocked_at_login_and_for_existing_tokens(): void
    {
        [$tid, $token] = $this->register('ISP A', 'a@a.test');
        Tenant::whereKey($tid)->update(['status' => 'suspended', 'suspended_at' => now()]);
        $this->getJson('/api/v1/locations', $this->auth($token))->assertForbidden();
        $this->postJson('/api/v1/auth/login', ['email' => 'a@a.test', 'password' => 'Str0ngPassw0rd'])->assertForbidden();
    }

    public function test_login_is_generic_on_failure_and_rate_limited(): void
    {
        $this->register('ISP A', 'a@a.test');
        $unknown = $this->postJson('/api/v1/auth/login', ['email' => 'nobody@x.test', 'password' => 'whatever'])->assertStatus(422);
        $wrong = $this->postJson('/api/v1/auth/login', ['email' => 'a@a.test', 'password' => 'wrong'])->assertStatus(422);
        $this->assertSame($unknown->json('message'), $wrong->json('message'));
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', ['email' => 'a@a.test', 'password' => 'wrong']);
        }
        $this->postJson('/api/v1/auth/login', ['email' => 'a@a.test', 'password' => 'Str0ngPassw0rd'])->assertStatus(429);
    }

    public function test_audit_redacts_secrets_and_responses_carry_headers(): void
    {
        $this->register('ISP A', 'a@a.test');
        $user = User::first();
        app(\App\Services\AuditLogger::class)->record('x.test', null, ['router_password' => 'hunter2', 'nested' => ['api_token' => 'abc', 'ok' => 1]], $user);
        $log = AuditLog::where('action', 'x.test')->first();
        $this->assertSame('[REDACTED]', $log->meta['router_password']);
        $this->assertSame('[REDACTED]', $log->meta['nested']['api_token']);
        $this->assertSame(1, $log->meta['nested']['ok']);

        $r = $this->getJson('/api/v1/auth/me');
        $this->assertNotEmpty($r->headers->get('X-Correlation-Id'));
        $this->assertSame('nosniff', $r->headers->get('X-Content-Type-Options'));
    }
}
