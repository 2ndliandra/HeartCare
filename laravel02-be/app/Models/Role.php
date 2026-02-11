<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Role extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'roles';
    protected $fillable = ['name', 'guard_name', 'permission_ids'];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, null, 'role_ids', 'permission_ids');
    }

    public function givePermissionTo($permission)
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
        }
        $this->permissions()->attach($permission);
    }
}
