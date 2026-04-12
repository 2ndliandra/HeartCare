<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Article;
use App\Models\Dataset;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $totalUsers = User::count();
        $totalArticles = Article::count();
        $avgAccuracy = Dataset::where('status', 'active')->avg('accuracy_score') ?: 0;
        $activeDatasets = Dataset::where('status', 'active')->count();

        // Weekly user growth (mock for visualization)
        $growthData = [
            ['day' => 'Mon', 'users' => 12],
            ['day' => 'Tue', 'users' => 19],
            ['day' => 'Wed', 'users' => 15],
            ['day' => 'Thu', 'users' => 22],
            ['day' => 'Fri', 'users' => 30],
            ['day' => 'Sat', 'users' => 25],
            ['day' => 'Sun', 'users' => 35],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_articles' => $totalArticles,
                'avg_accuracy' => round($avgAccuracy, 2),
                'active_datasets' => $activeDatasets,
                'growth' => $growthData
            ]
        ]);
    }
}
