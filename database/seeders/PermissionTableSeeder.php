<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Optional: Truncate the table before seeding fresh data
        Schema::disableForeignKeyConstraints();
        Permission::truncate();
        Schema::enableForeignKeyConstraints();

        // Clear the cached permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permission names
        $permissions = [
            // User Management
            'user-menu',
            'user-create',
            'user-edit',
            'user-delete',
            'user-view',

            // Role Management
            'role-menu',
            'role-create',
            'role-edit',
            'role-delete',
            'role-view',

            // permission-menu Management
            'permission-menu',
            'permission-create',
            'permission-edit',
            'permission-delete',
            'permission-view',

            // Product Management
            'product-menu',
            'product-create',
            'product-edit',
            'product-delete',
            'product-view',

            // Category Management
            'category-menu',
            'category-create',
            'category-edit',
            'category-delete',
            'category-view',

            // Orders & Dashboard
            'order-manage',
            'dashboard-access',
        ];

        // Create each permission with the 'web' guard
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }
}
