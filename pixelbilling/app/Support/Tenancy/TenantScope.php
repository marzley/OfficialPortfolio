<?php

namespace App\Support\Tenancy;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Fail-closed: with no tenant in context the query matches nothing,
 * rather than leaking every tenant's rows.
 */
class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $id = app(TenantContext::class)->id();
        $id === null
            ? $builder->whereRaw('1 = 0')
            : $builder->where($model->getTable().'.tenant_id', $id);
    }
}
