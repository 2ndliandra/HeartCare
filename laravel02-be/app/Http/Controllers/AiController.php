<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AiService;
use App\Models\Chat;
use Illuminate\Support\Facades\Auth;

class AiController extends Controller
{
    /**
     * Display chat history for authenticated user
     */
    public function index()
    {
        $history = Chat::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    /**
     * Handle chat request and save to history
     */
    public function chat(Request $request, AiService $aiService)
    {
        $prompt = $request->input('prompt');
        $result = $aiService->generate($prompt);

        if (Auth::check()) {
            $responseText = is_array($result) ? ($result['message'] ?? 'Error fetching AI response') : $result;

            Chat::create([
                'user_id' => Auth::id(),
                'message' => $prompt,
                'response' => $responseText
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }

    /**
     * Original test endpoint, now uses chat logic
     */
    public function test(Request $request, AiService $aiService)
    {
        return $this->chat($request, $aiService);
    }
}