<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $agentRole = Role::create(['name' => 'agent']);
        $userRole = Role::create(['name' => 'user']);

        // Create permissions
        $permissions = [
            // Platform settings
            'view platform settings',
            'edit platform settings',
            
            // Packages
            'view packages',
            'create packages',
            'edit packages',
            'delete packages',
            
            // Activities
            'view activities',
            'create activities',
            'edit activities',
            'delete activities',
            
            // Bookings
            'view bookings',
            'create bookings',
            'edit bookings',
            'delete bookings',
            
            // Payments
            'view payments',
            'process payments',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign permissions to roles
        $adminRole->givePermissionTo(Permission::all());
        
        $agentRole->givePermissionTo([
            'view packages',
            'create packages',
            'edit packages',
            'delete packages',
            'view activities',
            'create activities',
            'edit activities',
            'delete activities',
            'view bookings',
        ]);
        
        // $userRole->givePermissionTo([
        //     'view packages',
        //     'view activities',
        //     'view bookings',
        //     'create bookings',
        // ]);
    }
}

