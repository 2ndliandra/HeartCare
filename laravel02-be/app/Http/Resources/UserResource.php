<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->_id ?? $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'initial' => strtoupper(substr($this->name, 0, 1)),
            'roles' => $this->roles ? $this->roles->pluck('name') : [],
            'created_at' => $this->created_at ? $this->created_at->toISOString() : null,
        ];
    }
}
