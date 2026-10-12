<?php

namespace App\Models;

use App\Support\Tenancy\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class ServiceLocation extends Model
{
    use BelongsToTenant;

    // tenant_id deliberately not fillable; set from TenantContext.
    protected $fillable = ['name', 'code', 'address', 'status'];
}
