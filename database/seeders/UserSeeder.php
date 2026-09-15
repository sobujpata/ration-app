<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin User
        $superAdmin = User::firstOrCreate([
            'email' => 'superadmin@gmail.com',
        ], [
            'name' => 'Super Admin',
            'password' => Hash::make('superadmin@gmail.com'),
        ]);

        // Create Admin User
        $admin = User::firstOrCreate([
            'email' => 'admin@gmail.com',
        ], [
            'name' => 'Admin',
            'password' => Hash::make('admin@gmail.com'),
        ]);

        // Create Customer User
        $customer = User::firstOrCreate([
            'email' => 'customer@gmail.com',
        ], [
            'name' => 'Customer',
            'password' => Hash::make('customer@gmail.com'),
        ]);

        // Assign Roles
        $superAdmin->assignRole('Super Admin');
        $admin->assignRole('Admin');
        $customer->assignRole('Customer');
    }
}
