<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AiService;

class AiController extends Controller
{
    public function test(Request $request, AiService $aiService)
    {
        $prompt = $request->input('prompt');

        $result = $aiService->generate($prompt);

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }
}