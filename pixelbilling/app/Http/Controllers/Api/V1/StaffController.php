<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StaffController extends Controller
{
    private const ASSIGNABLE = ['isp_admin', 'billing_manager', 'accountant', 'network_admin', 'support_agent', 'field_technician', 'read_only_staff'];

    public function index(Request $request)
    {
        return User::where('tenant_id', $request->user()->tenant_id)->select('id', 'name', 'email', 'role', 'status')->paginate(25);
    }

    public function store(Request $request, AuditLogger $audit)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190', 'unique:users,email'],
            'role' => ['required', Rule::in(self::ASSIGNABLE)], // owner/platform roles cannot be granted here
            'password' => ['required', Password::min(10)->letters()->numbers()],
        ]);
        $user = new User(['name' => $data['name'], 'email' => $data['email'], 'password' => $data['password']]);
        $user->tenant_id = $request->user()->tenant_id;
        $user->role = $data['role'];
        $user->save();
        $audit->record('staff.created', $user, ['role' => $user->role]);
        return response()->json(['data' => $user->only('id', 'name', 'email', 'role')], 201);
    }
}
