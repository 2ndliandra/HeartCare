<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Prediction;
use Carbon\Carbon;

class PredictionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Dummy data for User ID 1 and 3
        $users = [1, 3];

        foreach ($users as $userId) {
            Prediction::create([
                'user_id' => $userId,
                'input_data' => [
                    'age' => 45,
                    'gender' => 'male',
                    'systolic_bp' => 145,
                    'diastolic_bp' => 95,
                    'cholesterol' => 260,
                    'heart_rate' => 88,
                    'weight' => 80,
                    'height' => 170,
                    'smoking' => 'Ya',
                    'exercise' => 'Sedikit',
                ],
                'result_level' => 'TINGGI',
                'result_score' => 82,
                'created_at' => Carbon::now()->subDays(2)
            ]);

            Prediction::create([
                'user_id' => $userId,
                'input_data' => [
                    'age' => 30,
                    'gender' => 'female',
                    'systolic_bp' => 110,
                    'diastolic_bp' => 70,
                    'cholesterol' => 180,
                    'heart_rate' => 70,
                    'weight' => 55,
                    'height' => 160,
                    'smoking' => 'Tidak',
                    'exercise' => 'Rutin',
                ],
                'result_level' => 'RENDAH',
                'result_score' => 15,
                'created_at' => Carbon::now()->subDays(10)
            ]);

            Prediction::create([
                'user_id' => $userId,
                'input_data' => [
                    'age' => 50,
                    'gender' => 'male',
                    'systolic_bp' => 130,
                    'diastolic_bp' => 85,
                    'cholesterol' => 220,
                    'heart_rate' => 75,
                    'weight' => 75,
                    'height' => 175,
                    'smoking' => 'Tidak',
                    'exercise' => '3-4x Seminggu',
                ],
                'result_level' => 'RENDAH',
                'result_score' => 35,
                'created_at' => Carbon::now()->subMonths(1)
            ]);
        }
    }
}
