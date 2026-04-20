<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;

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
            'age' => 'required|numeric',
            'gender' => 'required|string',
            'systolic_bp' => 'required|numeric',
            'diastolic_bp' => 'required|numeric',
            'cholesterol' => 'required|numeric',
            'heart_rate' => 'required|numeric',
            'weight' => 'required|numeric',
            'height' => 'required|numeric',
            'smoking' => 'string',
            'exercise' => 'string',
            'history' => 'array',
        ]);

        $input = json_encode($validated);
        
        // Execute python script
        $process = Process::input($input)->run('python ' . base_path('predict_heart.py'));

        if ($process->successful()) {
            $result = json_decode($process->output(), true);
            
            // Apply binary logic: SEDANG -> TINGGI
            $level = strtoupper($result['risk_level'] ?? 'RENDAH');
            if ($level === 'SEDANG') $level = 'TINGGI';

            // Persist to MongoDB
            $prediction = Prediction::create([
                'user_id' => Auth::id(),
                'input_data' => $validated,
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
            'error' => 'Gagal menjalankan pemrosesan AI.',
            'details' => $process->errorOutput()
        ], 500);
    }
}
