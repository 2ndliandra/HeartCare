<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Prediction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class UserDashboardController extends Controller
{
    public function get()
    {
        $user = Auth::user();
        $predictions = Prediction::where('user_id', Auth::id())
            ->orderBy('created_at', 'asc')
            ->get();
        $consultations = Chat::where('user_id', Auth::id())
            ->get(['created_at']);
        $readArticles = is_array($user->read_article ?? null) ? array_values(array_unique($user->read_article)) : [];

        $currentMonthStart = Carbon::now()->startOfMonth();
        $previousMonthStart = Carbon::now()->subMonthNoOverflow()->startOfMonth();
        $previousMonthEnd = Carbon::now()->subMonthNoOverflow()->endOfMonth();

        $currentMonthCheckups = $predictions->filter(function (Prediction $prediction) use ($currentMonthStart) {
            return $prediction->created_at && Carbon::parse($prediction->created_at)->greaterThanOrEqualTo($currentMonthStart);
        })->count();

        $previousMonthCheckups = $predictions->filter(function (Prediction $prediction) use ($previousMonthStart, $previousMonthEnd) {
            if (!$prediction->created_at) {
                return false;
            }

            $createdAt = Carbon::parse($prediction->created_at);

            return $createdAt->betweenIncluded($previousMonthStart, $previousMonthEnd);
        })->count();

        $currentMonthConsultations = $consultations->filter(function (Chat $chat) use ($currentMonthStart) {
            return $chat->created_at && Carbon::parse($chat->created_at)->greaterThanOrEqualTo($currentMonthStart);
        })->count();

        $previousMonthConsultations = $consultations->filter(function (Chat $chat) use ($previousMonthStart, $previousMonthEnd) {
            if (!$chat->created_at) {
                return false;
            }

            $createdAt = Carbon::parse($chat->created_at);

            return $createdAt->betweenIncluded($previousMonthStart, $previousMonthEnd);
        })->count();

        $chartData = $predictions->map(function (Prediction $prediction) {
            $predictionId = (string) ($prediction->_id ?? $prediction->id);

            return [
                'id' => $predictionId,
                'date' => optional($prediction->created_at)?->toDateString(),
                'label' => optional($prediction->created_at)?->format('d M'),
                'score' => (float) ($prediction->result_score ?? 0),
                'risk_level' => $prediction->result_level,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_checkups' => $predictions->count(),
                    'checkups_trend' => $this->formatTrend($currentMonthCheckups - $previousMonthCheckups),
                    'total_consultations' => $consultations->count(),
                    'consultations_trend' => $this->formatTrend($currentMonthConsultations - $previousMonthConsultations),
                    'total_articles_read' => count($readArticles),
                ],
                'predictions' => $predictions,
                'chart_data' => $chartData,
            ],
        ]);
    }

    protected function formatTrend(int $difference): string
    {
        if ($difference > 0) {
            return '+' . $difference;
        }

        return (string) $difference;
    }
}
