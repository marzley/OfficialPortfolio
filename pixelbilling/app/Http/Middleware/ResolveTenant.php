<?php

namespace App\Http\Middleware;

use App\Support\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;

/** Tenant comes ONLY from the authenticated user, never from URL/body/headers. */
class ResolveTenant
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (! $user || $user->status !== 'active') {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        app(TenantContext::class)->set(null); // never inherit a previous request's tenant
        if ($user->tenant_id !== null) {
            $tenant = $user->tenant;
            if (! $tenant || ! $tenant->isUsable()) {
                return response()->json(['message' => 'This account is suspended. Contact support.'], 403);
            }
            app(TenantContext::class)->set($tenant);
        }
        return $next($request);
    }
}
