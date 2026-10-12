<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ServiceLocation;
use App\Services\AuditLogger;
use App\Support\Tenancy\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ServiceLocationController extends Controller
{
    public function index(Request $request)
    {
        return ServiceLocation::orderBy('name')->paginate(min((int) $request->query('per_page', 25), 100));
    }

    public function show(int $id)
    {
        return ['data' => ServiceLocation::findOrFail($id)]; // scope => other tenants' ids 404
    }

    public function store(Request $request, AuditLogger $audit)
    {
        $tenantId = app(TenantContext::class)->id();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'code' => ['required', 'string', 'max:30', 'alpha_dash', Rule::unique('service_locations')->where('tenant_id', $tenantId)],
            'address' => ['nullable', 'string', 'max:255'],
        ]);
        $loc = ServiceLocation::create($data);
        $audit->record('location.created', $loc);
        return response()->json(['data' => $loc], 201);
    }
}
