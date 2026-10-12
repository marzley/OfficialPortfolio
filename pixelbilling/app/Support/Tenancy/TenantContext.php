<?php

namespace App\Support\Tenancy;

use App\Models\Tenant;

/** Holds the tenant for the current request/job. Bound as a scoped singleton. */
class TenantContext
{
    private ?Tenant $tenant = null;

    public function set(?Tenant $tenant): void { $this->tenant = $tenant; }
    public function get(): ?Tenant { return $this->tenant; }
    public function id(): ?int { return $this->tenant?->id; }
}
