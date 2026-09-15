<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('admins can visit the dashboard', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'Admin', 'guard_name' => 'web']);
    $user->assignRole('Admin');
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('customers are redirected away from the dashboard', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'Customer', 'guard_name' => 'web']);
    $user->assignRole('Customer');
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('home'));
});
