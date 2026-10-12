<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $guarded = [];
    protected $casts = ['branding' => 'array', 'trial_ends_at' => 'datetime', 'suspended_at' => 'datetime'];

    public function users(): HasMany { return $this->hasMany(User::class); }
    public function isUsable(): bool { return in_array($this->status, ['trial', 'active'], true); }
}
