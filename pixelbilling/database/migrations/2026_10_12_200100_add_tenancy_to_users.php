<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            // null tenant_id => platform staff
            $t->foreignId('tenant_id')->nullable()->after('id')->constrained('tenants')->cascadeOnDelete();
            $t->string('role')->default('read_only_staff')->after('email');
            $t->string('phone')->nullable();
            $t->string('status')->default('active'); // active|disabled
            $t->timestamp('last_login_at')->nullable();
            $t->index(['tenant_id', 'role']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->dropConstrainedForeignId('tenant_id');
            $t->dropIndex(['tenant_id', 'role']);
            $t->dropColumn(['role', 'phone', 'status', 'last_login_at']);
        });
    }
};
