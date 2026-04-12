<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::first(); // Match with existing user if any
        $authorId = $admin ? $admin->id : 'admin_default_id';

        $articles = [
            [
                'title' => '10 Tips Menjaga Kesehatan Jantung di Usia Muda',
                'slug' => '10-tips-menjaga-kesehatan-jantung-di-usia-muda',
                'content' => 'Menjaga kesehatan jantung sejak dini sangatlah penting untuk mencegah risiko penyakit kardiovaskular di masa depan. Fokus pada olahraga rutin dan diet seimbang.',
                'thumbnail' => 'https://images.unsplash.com/photo-1773399452188-a42e29543bf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
                'author_id' => $authorId,
                'status' => 'published',
            ],
            [
                'title' => 'Peran Teknologi AI dalam Prediksi Risiko Penyakit',
                'slug' => 'peran-teknologi-ai-dalam-prediksi-risiko-penyakit',
                'content' => 'Bagaimana teknologi AI seperti HeartPredict membantu dokter dan pasien dalam mendeteksi gejala awal secara akurat melalui pengolahan data besar.',
                'thumbnail' => 'https://images.unsplash.com/photo-1596236100223-f3c656de3038?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
                'author_id' => $authorId,
                'status' => 'published',
            ],
            [
                'title' => 'Makanan Terbaik untuk Menurunkan Kolesterol Jahat',
                'slug' => 'makanan-terbaik-untuk-menurunkan-kolesterol-jahat',
                'content' => 'Daftar makanan super yang terbukti secara klinis dapat membantu menurunkan kadar LDL dalam tubuh secara alami seperti alpukat, gandum utuh, dan ikan berlemak.',
                'thumbnail' => 'https://images.unsplash.com/photo-1490818384919-62572a1e389e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
                'author_id' => $authorId,
                'status' => 'published',
            ],
        ];

        foreach ($articles as $articleData) {
            Article::updateOrCreate(['slug' => $articleData['slug']], $articleData);
        }
    }
}
