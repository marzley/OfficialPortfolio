<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Services\AuditLogger;
use App\Support\Tenancy\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function __construct(private AuditLogger $audit) {}

    /** ISP self-registration: creates tenant + owner atomically. */
    public function register(Request $request)
    {
        $data = $request->validate([
            'business_name' => ['required', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::min(10)->letters()->numbers()],
        ]);

        [$tenant, $user] = DB::transaction(function () use ($data) {
            $tenant = Tenant::create([
                'name' => $data['business_name'],
                'slug' => $this->uniqueSlug($data['business_name']),
                'status' => 'trial',
                'trial_ends_at' => now()->addDays(14),
                'contact_email' => $data['email'],
                'contact_phone' => $data['phone'] ?? null,
            ]);
            $user = new User(['name' => $data['name'], 'email' => $data['email'], 'phone' => $data['phone'] ?? null, 'password' => $data['password']]);
            $user->tenant_id = $tenant->id;
            $user->role = 'isp_owner';
            $user->save();
            return [$tenant, $user];
        });

        app(TenantContext::class)->set($tenant);
        $this->audit->record('tenant.registered', $tenant, ['owner_id' => $user->id], $user);

        return response()->json([
            'data' => ['tenant' => ['id' => $tenant->id, 'name' => $tenant->name, 'slug' => $tenant->slug, 'status' => $tenant->status]],
            'token' => $user->createToken('api')->plainTextToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);

        $user = User::where('email', $data['email'])->first();
        // Same response for unknown user / wrong password / disabled: no account enumeration.
        if (! $user || $user->status !== 'active' || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 422);
        }
        if ($user->tenant_id && ! $user->tenant->isUsable()) {
            return response()->json(['message' => 'This account is suspended. Contact support.'], 403);
        }

        $user->forceFill(['last_login_at' => now()])->save();
        $this->audit->record('auth.login', $user, [], $user);

        return response()->json(['token' => $user->createToken('api')->plainTextToken]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->noContent();
    }

    public function me(Request $request)
    {
        $u = $request->user();
        return ['data' => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email, 'role' => $u->role, 'tenant_id' => $u->tenant_id]];
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'isp';
        $slug = $base;
        while (Tenant::where('slug', $slug)->exists()) {
            $slug = $base.'-'.Str::lower(Str::random(4));
        }
        return $slug;
    }
}
