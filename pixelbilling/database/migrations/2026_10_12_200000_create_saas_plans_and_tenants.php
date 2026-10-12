<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saas_plans', function (Blueprint $t) {
            $t->id();
            $t->string('code')->unique();
            $t->string('name');
            $t->unsignedBigInteger('price_minor')->default(0); // minor units, never floats
            $t->char('currency', 3)->default('KES');
            $t->unsignedInteger('max_customers')->nullable(); // null = unlimited
            $t->unsignedInteger('max_routers')->nullable();
            $t->boolean('active')->default(true);
            $t->timestamps();
        });

        Schema::create('tenants', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('slug')->unique();
            $t->string('status')->default('trial'); // trial|active|suspended|cancelled
            $t->foreignId('saas_plan_id')->nullable()->constrained('saas_plans')->nullOnDelete();
            $t->string('timezone')->default('Africa/Nairobi');
            $t->char('currency', 3)->default('KES');
            $t->string('contact_email')->nullable();
            $t->string('contact_phone')->nullable();
            $t->json('branding')->nullable();
            $t->timestamp('trial_ends_at')->nullable();
            $t->timestamp('suspended_at')->nullable();
            $t->string('suspension_reason')->nullable();
            $t->timestamps();
            $t->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
        Schema::dropIfExists('saas_plans');
    }
};
