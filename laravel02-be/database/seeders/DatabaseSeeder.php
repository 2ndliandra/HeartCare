<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
 
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        \App\Models\Voter::factory(25)->create();
        \App\Models\User::factory(25)->create();

        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
