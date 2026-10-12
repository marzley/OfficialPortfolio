<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Support\Tenancy\TenantContext;
use Illuminate\Database\Eloquent\Model;

class AuditLogger
{
    private const REDACT = ['password', 'token', 'secret', 'passkey', 'pin', 'authorization'];

    public function record(string $action, ?Model $subject = null, array $meta = [], $user = null): AuditLog
    {
        $user ??= auth()->user();
        return AuditLog::create([
            'tenant_id' => app(TenantContext::class)->id() ?? $user?->tenant_id,
            'user_id' => $user?->id,
            'action' => $action,
            'subject_type' => $subject ? $subject::class : null,
            'subject_id' => $subject?->getKey(),
            'meta' => $this->redact($meta),
            'ip' => request()?->ip(),
            'correlation_id' => request()?->attributes->get('correlation_id'),
        ]);
    }

    private function redact(array $data): array
    {
        foreach ($data as $k => $v) {
            if (is_string($k) && collect(self::REDACT)->contains(fn ($w) => str_contains(strtolower($k), $w))) {
                $data[$k] = '[REDACTED]';
            } elseif (is_array($v)) {
                $data[$k] = $this->redact($v);
            }
        }
        return $data;
    }
}
