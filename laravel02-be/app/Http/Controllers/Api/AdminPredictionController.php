<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prediction;
use Carbon\Carbon;

class AdminPredictionController extends Controller
{
    public function stats()
    {
        $todayPredictions = Prediction::whereDate('created_at', Carbon::today())->count();
        $totalPredictions = Prediction::count();

        $rendah = Prediction::where('result_level', 'RENDAH')->count();
        $tinggi = Prediction::where('result_level', 'TINGGI')->count();

        $trends = [
            [ 'name' => 'Rendah', 'value' => $rendah, 'color' => '#10b981' ],
            [ 'name' => 'Tinggi', 'value' => $tinggi, 'color' => '#ef4444' ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'today_predictions' => $todayPredictions,
                'total_predictions' => $totalPredictions,
                'trends' => $trends
            ]
        ]);
    }
}
