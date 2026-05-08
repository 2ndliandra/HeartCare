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
            'phone_number' => $this->phone_number,
            'gender' => $this->gender,
            'address' => $this->address,
            'birth_date' => $this->birth_date,
            'profile_picture' => $this->profile_picture,
            'initial' => strtoupper(substr($this->name, 0, 1)),
            'roles' => $this->roles ? $this->roles->pluck('name') : [],
            'read_article' => $this->read_article ?? [],
            'created_at' => $this->created_at ? $this->created_at->toISOString() : null,
        ];
    }
}
