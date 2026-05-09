<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatasetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Dataset::create([
            'name' => 'Public Clinical Data 2024 (Primary)',
            'description' => 'Dataset gabungan dari UCI Heart Disease dan Cleveland Clinic dengan total 35.000 record terverifikasi.',
            'sample_count' => 35000,
            'accuracy_score' => 94.2,
            'status' => 'active',
        ]);

        \App\Models\Dataset::create([
            'name' => 'Synthetic Hospital Bio-Data v1',
            'description' => 'Data sintetik yang diproduksi menggunakan GAN untuk menyeimbangkan distribusi fitur demografis Asia.',
            'sample_count' => 12000,
            'accuracy_score' => 91.5,
            'status' => 'active',
        ]);

        \App\Models\Dataset::create([
            'name' => 'Legacy Research Set 2019',
            'description' => 'Data penelitian awal yang digunakan untuk validasi parameter dasar.',
            'sample_count' => 5000,
            'accuracy_score' => 88.0,
            'status' => 'archived',
        ]);
    }
}
