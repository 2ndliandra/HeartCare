<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Article;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $totalUsers = User::count();
        $publishedArticles = Article::where('status', 'published')->count();
        $dayLabels = [
            1 => 'Sen',
            2 => 'Sel',
            3 => 'Rab',
            4 => 'Kam',
            5 => 'Jum',
            6 => 'Sab',
            7 => 'Min',
        ];

        $startDate = Carbon::now()->startOfDay()->subDays(6);

        $users = User::where('created_at', '>=', $startDate)
            ->get(['created_at']);

        $dailyCounts = [];
        foreach ($users as $user) {
            if (!$user->created_at) {
                continue;
            }

            $dateKey = Carbon::parse($user->created_at)->startOfDay()->toDateString();
            $dailyCounts[$dateKey] = ($dailyCounts[$dateKey] ?? 0) + 1;
        }

        $growthData = [];
        for ($offset = 6; $offset >= 0; $offset--) {
            $date = Carbon::now()->startOfDay()->subDays($offset);
            $dateKey = $date->toDateString();

            $growthData[] = [
                'day' => $dayLabels[$date->dayOfWeekIso],
                'users' => $dailyCounts[$dateKey] ?? 0,
                'date' => $dateKey,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_articles' => $publishedArticles,
                'growth' => $growthData
            ]
        ]);
    }
}
