<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::first();
        $authorId = $admin ? (string) $admin->id : 'admin_default_id';

        $categories = collect([
            ['name' => 'Gaya Hidup'],
            ['name' => 'Nutrisi'],
            ['name' => 'Kolesterol'],
            ['name' => 'Hipertensi'],
            ['name' => 'Aktivitas Fisik'],
        ])->mapWithKeys(function (array $categoryData) {
            $slug = Str::slug($categoryData['name']);
            $category = Category::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $categoryData['name'],
                    'slug' => $slug,
                ]
            );

            return [$categoryData['name'] => $category];
        });

        $articles = [
            [
                'title' => 'Langkah Harian untuk Menurunkan Risiko Penyakit Jantung',
                'slug' => 'langkah-harian-untuk-menurunkan-risiko-penyakit-jantung',
                'category' => 'Gaya Hidup',
                'thumbnail' => '/assets/content1.png',
                'status' => 'published',
                'paragraphs' => [
                    'Penyakit kardiovaskular masih menjadi penyebab kematian utama di dunia. Organisasi Kesehatan Dunia menjelaskan bahwa sebagian besar kasus sebenarnya dapat dicegah dengan memperbaiki faktor risiko yang dapat diubah seperti pola makan, kurang gerak, merokok, dan konsumsi alkohol berlebihan.',
                    'Dalam praktik sehari-hari, perubahan kecil yang konsisten sering lebih efektif dibanding perubahan ekstrem yang hanya bertahan sebentar. Tidur cukup, membatasi makanan ultra-proses, berjalan kaki lebih sering, dan memantau tekanan darah adalah langkah sederhana yang memberi dampak nyata pada kesehatan jantung.',
                    'Kebiasaan seperti mengurangi garam, menambah sayur dan buah, serta menjaga berat badan sehat membantu menekan tekanan darah dan kadar lemak darah. Saat dikombinasikan dengan olahraga teratur, tubuh lebih mampu menjaga elastisitas pembuluh darah dan beban kerja jantung menjadi lebih ringan.',
                    'Yang tidak kalah penting adalah pemeriksaan berkala. Risiko jantung sering berkembang tanpa gejala yang jelas. Dengan skrining sejak dini, seseorang bisa mengetahui apakah ada tekanan darah tinggi, gula darah yang tidak terkendali, atau kolesterol yang meningkat sebelum muncul komplikasi.',
                ],
            ],
            [
                'title' => 'Strategi Pola Makan Sehat untuk Menjaga Kolesterol Tetap Stabil',
                'slug' => 'strategi-pola-makan-sehat-untuk-menjaga-kolesterol-tetap-stabil',
                'category' => 'Nutrisi',
                'thumbnail' => '/assets/content2.png',
                'status' => 'published',
                'paragraphs' => [
                    'Pusat Pengendalian dan Pencegahan Penyakit Amerika Serikat menekankan bahwa tubuh sebenarnya sudah mampu memproduksi kolesterol sendiri. Karena itu, fokus utama pencegahan kolesterol tinggi adalah mengurangi makanan tinggi lemak jenuh, lemak trans, garam, dan gula tambahan.',
                    'Pilihan yang dianjurkan mencakup biji-bijian utuh, kacang-kacangan, ikan, alpukat, buah, dan sayur. Makanan tinggi serat seperti oatmeal dan kacang merah dapat membantu menurunkan kadar LDL atau kolesterol jahat, sekaligus mendukung kesehatan pencernaan dan kestabilan gula darah.',
                    'Sebaliknya, pola makan yang didominasi gorengan, daging berlemak, mentega, serta makanan kemasan berisiko meningkatkan kolesterol dan trigliserida. Jika dibiarkan, kondisi ini mempercepat penumpukan plak pada pembuluh darah dan meningkatkan risiko serangan jantung maupun stroke.',
                    'Menerapkan pola makan sehat tidak harus rumit. Mulailah dari porsi yang realistis: ganti camilan tinggi gula dengan buah, pilih lauk rendah lemak, dan biasakan membaca label nutrisi. Konsistensi jauh lebih penting dibanding diet yang terlalu ketat namun sulit dipertahankan.',
                ],
            ],
            [
                'title' => 'Memahami Kolesterol Baik dan Kolesterol Jahat dengan Cara Sederhana',
                'slug' => 'memahami-kolesterol-baik-dan-kolesterol-jahat-dengan-cara-sederhana',
                'category' => 'Kolesterol',
                'thumbnail' => '/assets/content3.png',
                'status' => 'published',
                'paragraphs' => [
                    'Kolesterol sering dipahami sebagai sesuatu yang sepenuhnya buruk, padahal tubuh tetap membutuhkannya untuk membentuk hormon, vitamin tertentu, dan struktur sel. Masalah muncul ketika kadar LDL terlalu tinggi atau kadar HDL terlalu rendah dalam waktu lama.',
                    'LDL dikenal sebagai kolesterol jahat karena mudah menumpuk di dinding pembuluh darah. Penumpukan ini membentuk plak yang mempersempit aliran darah ke jantung dan otak. Sementara itu, HDL membantu membawa kelebihan kolesterol kembali ke hati untuk diolah dan dikeluarkan.',
                    'Karena itu, tujuan pemeriksaan kolesterol bukan hanya melihat satu angka total, melainkan memahami pola keseluruhan profil lipid. Seseorang bisa saja merasa sehat, namun tetap memiliki kadar LDL tinggi tanpa gejala. Kondisi inilah yang sering membuat penyakit jantung datang terlambat terdeteksi.',
                    'Gaya hidup aktif, berat badan yang terjaga, pola makan kaya serat, dan berhenti merokok adalah kombinasi yang membantu memperbaiki profil kolesterol. Bila diperlukan, dokter dapat menyarankan terapi obat sebagai bagian dari pencegahan jangka panjang.',
                ],
            ],
            [
                'title' => 'Kenapa Tekanan Darah Tinggi Perlu Diwaspadai Sejak Dini',
                'slug' => 'kenapa-tekanan-darah-tinggi-perlu-diwaspadai-sejak-dini',
                'category' => 'Hipertensi',
                'thumbnail' => '/assets/content4.png',
                'status' => 'published',
                'paragraphs' => [
                    'Tekanan darah tinggi sering disebut silent killer karena dapat berkembang perlahan tanpa keluhan yang jelas. Padahal, tekanan darah yang terus tinggi membuat jantung bekerja lebih keras dan mempercepat kerusakan pada pembuluh darah, ginjal, otak, dan mata.',
                    'WHO memasukkan tekanan darah tinggi sebagai salah satu faktor risiko antara paling penting untuk penyakit jantung dan stroke. Saat pembuluh darah mengalami tekanan terus-menerus, dindingnya menjadi kurang elastis dan lebih mudah mengalami penyempitan atau kerusakan.',
                    'Faktor pemicunya beragam: konsumsi garam berlebih, berat badan berlebih, kurang aktivitas fisik, stres berkepanjangan, hingga kebiasaan merokok. Riwayat keluarga juga berperan, sehingga orang dengan orang tua hipertensi sebaiknya lebih rutin melakukan pemantauan.',
                    'Kabar baiknya, hipertensi dapat dikelola. Pembatasan garam, aktivitas fisik teratur, pengelolaan stres, dan kepatuhan pada obat bila diresepkan merupakan langkah utama. Semakin cepat terdeteksi, semakin besar peluang mencegah komplikasi jangka panjang.',
                ],
            ],
            [
                'title' => 'Target Aktivitas Fisik Mingguan untuk Jantung yang Lebih Kuat',
                'slug' => 'target-aktivitas-fisik-mingguan-untuk-jantung-yang-lebih-kuat',
                'category' => 'Aktivitas Fisik',
                'thumbnail' => '/assets/Banner.png',
                'status' => 'published',
                'paragraphs' => [
                    'American Heart Association merekomendasikan setidaknya 150 menit aktivitas aerobik intensitas sedang per minggu, atau 75 menit aktivitas intensitas tinggi, idealnya dibagi ke beberapa hari. Aktivitas sederhana seperti jalan cepat, bersepeda, atau berenang sudah termasuk langkah yang sangat baik.',
                    'Selain itu, latihan penguatan otot setidaknya dua kali seminggu juga penting. Aktivitas fisik tidak hanya memperkuat otot dan sendi, tetapi juga membantu mengontrol tekanan darah, gula darah, kadar kolesterol, berat badan, dan kualitas tidur.',
                    'Bagi orang yang banyak duduk saat bekerja, prinsip move more, sit less sangat relevan. Berdiri tiap satu jam, berjalan singkat setelah makan, atau memilih tangga daripada lift bisa menjadi kebiasaan kecil yang akumulatif manfaatnya besar untuk jantung.',
                    'Yang terpenting adalah keberlanjutan. Tidak semua orang perlu langsung berolahraga berat. Memulai dari target yang realistis lalu menaikkan durasi atau intensitas secara bertahap akan membuat kebiasaan aktif lebih mudah dipertahankan dalam jangka panjang.',
                ],
            ],
        ];

        foreach ($articles as $articleData) {
            $category = $categories->get($articleData['category']);
            $content = collect($articleData['paragraphs'])
                ->map(fn (string $paragraph) => '<p>' . e($paragraph) . '</p>')
                ->implode('');

            $rawContent = json_encode([
                'blocks' => collect($articleData['paragraphs'])
                    ->map(fn (string $paragraph) => [
                        'type' => 'paragraph',
                        'data' => ['text' => $paragraph],
                    ])
                    ->values()
                    ->all(),
            ], JSON_UNESCAPED_UNICODE);

            Article::updateOrCreate(
                ['slug' => $articleData['slug']],
                [
                    'title' => $articleData['title'],
                    'slug' => $articleData['slug'],
                    'content' => $content,
                    'raw_content' => $rawContent,
                    'category_id' => (string) ($category->_id ?? $category->id),
                    'category' => $category->name,
                    'thumbnail' => $articleData['thumbnail'],
                    'author_id' => $authorId,
                    'status' => $articleData['status'],
                ]
            );
        }

        Cache::forget('all_categories');
    }
}
