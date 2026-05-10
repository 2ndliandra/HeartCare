<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TitleOnlyArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            'Cara Menjaga Kesehatan Jantung di Usia Muda',
            'Manfaat Olahraga Lari untuk Sirkulasi Darah',
            'Pentingnya Cek Kolesterol Secara Rutin',
            'Makanan yang Harus Dihindari Penderita Darah Tinggi',
            'Tips Mengelola Stres Agar Jantung Tetap Sehat',
        ];

        foreach ($articles as $title) {
            Article::create([
                'title' => $title,
                'slug' => Str::slug($title) . '-' . Str::random(5),
                'content' => 'Konten artikel untuk ' . $title,
                'raw_content' => 'Konten artikel untuk ' . $title,
                'thumbnail' => null,
                'author_id' => 'system',
                'status' => 'published',
            ]);
        }
    }
}