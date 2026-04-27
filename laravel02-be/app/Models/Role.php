<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Role extends Model
{
    protected $connection = 'mongodb';
    protected $fillable = ['name', 'guard_name'];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_has_permissions');
    }

    public function givePermissionTo($permission)
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
            $this->permissions()->syncWithoutDetaching([$permission->id]);
            return;
        }

        // Handle collection of permissions
        if ($permission instanceof \Illuminate\Database\Eloquent\Collection) {
            foreach ($permission as $perm) {
                $this->permissions()->syncWithoutDetaching([$perm->id]);
            }
            return;
        }

        $this->permissions()->syncWithoutDetaching([$permission->id]);
    }
}
