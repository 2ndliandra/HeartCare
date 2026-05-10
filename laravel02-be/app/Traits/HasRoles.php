<?php

namespace App\Traits;

use App\Models\Role;
use App\Models\Permission;

trait HasRoles
{
    public function roles()
    {
        return $this->belongsToMany(Role::class, null, 'user_ids', 'role_ids');
    }

    public function assignRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }

        $roleId = (string) $role->id;
        $userId = (string) $this->id;

        $roleIds = collect($this->role_ids ?? [])
            ->map(fn ($id) => (string) $id)
            ->push($roleId)
            ->unique()
            ->values()
            ->all();

        $this->forceFill(['role_ids' => $roleIds])->save();

        $userIds = collect($role->user_ids ?? [])
            ->map(fn ($id) => (string) $id)
            ->push($userId)
            ->unique()
            ->values()
            ->all();

        $role->forceFill(['user_ids' => $userIds])->save();
        $this->unsetRelation('roles');
    }

    public function syncRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }

        $roleId = (string) $role->id;
        $userId = (string) $this->id;

        foreach (Role::whereIn('_id', $this->role_ids ?? [])->get() as $currentRole) {
            $userIds = collect($currentRole->user_ids ?? [])
                ->map(fn ($id) => (string) $id)
                ->reject(fn ($id) => $id === $userId)
                ->values()
                ->all();

            $currentRole->forceFill(['user_ids' => $userIds])->save();
        }

        $this->forceFill(['role_ids' => [$roleId]])->save();

        $userIds = collect($role->user_ids ?? [])
            ->map(fn ($id) => (string) $id)
            ->push($userId)
            ->unique()
            ->values()
            ->all();

        $role->forceFill(['user_ids' => $userIds])->save();
        $this->unsetRelation('roles');
    }

    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles->contains('name', $role);
        }
        return $this->roles->contains($role);
    }

    public function hasPermissionTo($permission)
    {
        // Check permissions via roles
        foreach ($this->roles as $role) {
            if ($role->permissions->contains('name', $permission)) {
                return true;
            }
        }
        return false;
    }
}
