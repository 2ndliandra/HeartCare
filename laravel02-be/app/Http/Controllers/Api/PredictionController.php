<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use App\Models\Prediction;
use Illuminate\Support\Facades\Auth;

class PredictionController extends Controller
{
    public function index()
    {
        $predictions = Prediction::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $predictions
        ]);
    }

    public function predict(Request $request)
    {
        $validated = $request->validate([
            'age' => 'required|numeric|min:1|max:120',
            'gender' => 'required|string',
            'systolic_bp' => 'required|numeric|min:70|max:250',
            'diastolic_bp' => 'required|numeric|min:40|max:150',
            'cholesterol' => 'required|numeric|min:80|max:400',
            'weight' => 'required|numeric|min:25|max:250',
            'height' => 'required|numeric|min:100|max:230',
            'blood_sugar' => 'numeric|nullable|min:50|max:500',
            'smoking' => 'string|nullable',
            'exercise' => 'string|nullable',
            'alcohol' => 'string|nullable',
        ]);

        if ((float) $validated['systolic_bp'] <= (float) $validated['diastolic_bp']) {
            return response()->json([
                'message' => 'Data tekanan darah tidak valid.',
                'errors' => [
                    'systolic_bp' => ['Tekanan darah sistolik harus lebih besar dari diastolik.'],
                ],
            ], 422);
        }

        $payload = [
            ...$validated,
            'blood_sugar' => $validated['blood_sugar'] ?? 90,
            'smoking' => $this->normalizeSmoking($validated['smoking'] ?? null),
            'exercise' => $this->normalizeExercise($validated['exercise'] ?? null),
            'alcohol' => $this->normalizeBooleanLifestyle($validated['alcohol'] ?? null),
        ];

        // Send request to Flask API
        try {
            $response = Http::timeout(30)->post('http://localhost:5000/predict', $payload);

            if ($response->successful()) {
                $result = $response->json();
                
                if (isset($result['error'])) {
                    return response()->json([
                        'error' => 'Gagal menjalankan pemrosesan AI.',
                        'details' => $result['error']
                    ], 500);
                }
                
                // Apply binary logic: SEDANG -> TINGGI
                $level = strtoupper($result['risk_level'] ?? 'RENDAH');
                if ($level === 'SEDANG') $level = 'TINGGI';

                // Persist to MongoDB
                $prediction = Prediction::create([
                    'user_id' => Auth::id(),
                    'input_data' => $payload,
                    'result_level' => $level,
                    'result_score' => $result['risk_score'] ?? 0,
                ]);

                return response()->json([
                    'success' => true,
                    'prediction' => [
                        'id' => $prediction->id,
                        'risk_level' => $level,
                        'risk_score' => $prediction->result_score,
                        'created_at' => $prediction->created_at
                    ]
                ]);
            }

            return response()->json([
                'error' => 'Gagal menghubungi server AI.',
                'details' => $response->body()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal menghubungi server AI.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    protected function normalizeSmoking(?string $value): string
    {
        $normalized = strtolower(trim((string) $value));

        return in_array($normalized, ['yes', 'ya', 'true', '1', 'kadang', 'sering'], true)
            ? 'yes'
            : 'no';
    }

    protected function normalizeExercise(?string $value): string
    {
        $normalized = strtolower(trim((string) $value));

        return in_array($normalized, ['yes', 'ya', 'true', '1', '1-2x seminggu', '3-4x seminggu', 'setiap hari'], true)
            ? 'yes'
            : 'no';
    }

    protected function normalizeBooleanLifestyle(?string $value): string
    {
        $normalized = strtolower(trim((string) $value));

        return in_array($normalized, ['yes', 'ya', 'true', '1', 'kadang', 'sering'], true)
            ? 'yes'
            : 'no';
    }
}
