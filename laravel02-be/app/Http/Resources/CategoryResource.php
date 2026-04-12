<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'slug' => $this->slug,
            'color' => $this->generateBrandColor($this->slug),
            'article_count' => $this->whenNotNull($this->articles_count),
        ];
    }

    /**
     * Generate a deterministic brand color based on category slug.
     */
    protected function generateBrandColor($slug)
    {
        $colors = ['slate', 'primary', 'blue', 'indigo', 'emerald', 'amber', 'rose'];
        $index = abs(crc32($slug)) % count($colors);
        return $colors[$index];
    }
}
