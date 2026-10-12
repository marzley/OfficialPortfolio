<?php

namespace Database\Seeders;

use App\Models\SaasPlan;
use Illuminate\Database\Seeder;

/** Reference data only (SaaS plans). Idempotent. No demo customers or payments. */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['code' => 'starter', 'name' => 'Starter', 'price_minor' => 250000, 'max_customers' => 100, 'max_routers' => 2],
            ['code' => 'growth', 'name' => 'Growth', 'price_minor' => 750000, 'max_customers' => 1000, 'max_routers' => 10],
            ['code' => 'scale', 'name' => 'Scale', 'price_minor' => 2000000, 'max_customers' => null, 'max_routers' => null],
        ] as $p) {
            SaasPlan::updateOrCreate(['code' => $p['code']], $p + ['currency' => 'KES', 'active' => true]);
        }
    }
}
