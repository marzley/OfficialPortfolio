<?php

namespace App\Support\Tenancy;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope());

        static::creating(function ($model) {
            $ctx = app(TenantContext::class)->id();
            if ($ctx === null && empty($model->tenant_id)) {
                throw new \LogicException('Cannot create tenant-owned record without a tenant context.');
            }
            // Context always wins: callers cannot create rows in another tenant.
            if ($ctx !== null) {
                $model->tenant_id = $ctx;
            }
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
