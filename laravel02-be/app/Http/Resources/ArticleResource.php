<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'raw_content' => $this->raw_content,
            'category_id' => $this->category_id,
            'category' => $this->category,
            'category_data' => $this->whenLoaded('categoryRelation', function () {
                return [
                    'id' => $this->categoryRelation?->_id ?? $this->categoryRelation?->id,
                    'name' => $this->categoryRelation?->name,
                    'slug' => $this->categoryRelation?->slug,
                ];
            }),
            'thumbnail' => $this->thumbnail,
            'status' => $this->status,
            'author' => new UserResource($this->whenLoaded('author')),
            'reading_time' => $this->calculateReadingTime($this->content),
            'created_at' => $this->created_at ? $this->created_at->toISOString() : null,
            'updated_at' => $this->updated_at ? $this->updated_at->toISOString() : null,
        ];
    }

    /**
     * Calculate estimated reading time in minutes.
     */
    protected function calculateReadingTime($content)
    {
        $wordCount = str_word_count(strip_tags($content));
        return max(1, ceil($wordCount / 200));
    }
}
