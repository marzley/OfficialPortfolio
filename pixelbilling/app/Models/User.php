<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// tenant_id / role / status are intentionally NOT mass-assignable.
#[Fillable(['name', 'email', 'password', 'phone'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'last_login_at' => 'datetime', 'password' => 'hashed'];
    }

    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }

    public function isPlatform(): bool { return $this->tenant_id === null; }

    public function can($ability, $arguments = []): bool
    {
        if (! is_string($ability) || ! str_contains($ability, '.')) {
            return parent::can($ability, $arguments);
        }
        return $this->hasPermission($ability);
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->status !== 'active') {
            return false;
        }
        $perms = config("permissions.roles.{$this->role}", []);
        if (in_array('*', $perms, true)) {
            // wildcard only applies to tenant-scoped roles, never platform permissions
            return $this->tenant_id !== null && ! str_starts_with($permission, 'platform.');
        }
        return in_array($permission, $perms, true);
    }
}
