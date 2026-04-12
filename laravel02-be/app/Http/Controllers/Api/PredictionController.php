<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;

class PredictionController extends Controller
{
    public function predict(Request $request)
    {
        $validated = $request->validate([
            'age' => 'required|numeric',
            'gender' => 'required|string',
            'bloodPressure' => 'required|numeric',
            'cholesterol' => 'required|numeric',
            'heartRate' => 'required|numeric',
            'history' => 'array',
        ]);

        $input = json_encode($validated);
        
        // Execute python script
        // Note: Assuming python is in PATH. On windows it might be 'python' or 'py'
        $process = Process::input($input)->run('python ' . base_path('predict_heart.py'));

        if ($process->successful()) {
            return response()->json(json_decode($process->output()));
        }

        return response()->json([
            'error' => 'Gagal menjalankan pemrosesan AI.',
            'details' => $process->errorOutput()
        ], 500);
    }
}
