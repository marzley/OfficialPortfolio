# PixelBilling System

ISP billing, network management and subscriber automation by Marzley Tech Solutions.
Laravel 13 / PHP 8.3, Sanctum token auth, multi-tenant.

> **Status: Phase 1 (foundation) only.** Not production-ready. See "Not yet built".

## Run
    composer install && cp .env.example .env && php artisan key:generate
    php artisan migrate --seed && php artisan serve
    php artisan test

## Phase 1 contents
- Tenants + SaaS plans (money in integer minor units).
- ISP self-registration (tenant + owner in one transaction), login, logout, `me`.
- **Tenant isolation**: `BelongsToTenant` trait + `TenantScope`. Tenant is derived only from the
  authenticated user (`ResolveTenant`), never from request input. The scope fails closed
  (no tenant context => no rows; creating without context throws). `tenant_id` is not mass-assignable.
- **RBAC**: role -> permission map in `config/permissions.php`, enforced by `can.do:<permission>` middleware.
  Platform roles have no tenant data permissions. Owner `*` never includes `platform.*`.
- Suspended tenants are blocked at login and for already-issued tokens.
- Audit log with secret redaction; correlation IDs; security headers; login/register rate limits.
- Sample tenant-owned resource (`service_locations`) and staff management as the pattern for later modules.

## API (prefix `/api/v1`, Bearer token)
| Method | Path | Permission |
|---|---|---|
| POST | auth/register, auth/login | public (throttled) |
| POST | auth/logout; GET auth/me | authenticated |
| GET | locations, locations/{id} | locations.view |
| POST | locations | locations.manage |
| GET/POST | staff | staff.manage |

## Not yet built (be aware)
Customers, packages, subscriptions, invoicing, MikroTik, hotspot/PPPoE, Daraja/M-Pesa, vouchers,
notifications, reports, customer portal, React frontend, MFA, per-tenant role overrides,
platform-admin tooling and audited support access, Docker/Nginx, backups.
Tested only on SQLite; PostgreSQL migrations are unverified. No external integration has been exercised.
