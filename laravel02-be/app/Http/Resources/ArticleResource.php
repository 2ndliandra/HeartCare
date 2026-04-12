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
            'category' => $this->category,
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
