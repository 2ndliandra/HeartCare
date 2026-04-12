<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * User registration with UserResource transformation.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:mongodb.users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => (string) $request->name,
            'email' => (string) $request->email,
            'password' => Hash::make((string) $request->password),
        ]);

        $user->assignRole('user');
        $token = $user->createToken('auth_token')->plainTextToken;

        return (new UserResource($user))->additional([
            'success' => true,
            'message' => 'Registrasi berhasil',
            'data' => [
                'token' => $token
            ]
        ])->response()->setStatusCode(201);
    }

    /**
     * Login with UserResource transformation.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $throttleKey = Str::lower($request->email) . '|' . $request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'success' => false, 
                'message' => "Terlalu banyak percobaan login. Silakan coba lagi dalam $seconds detik."
            ], 429);
        }

        $user = User::where('email', (string) $request->email)->first();

        if (!$user || !Hash::check((string) $request->password, $user->password)) {
            RateLimiter::hit($throttleKey, 60);
            return response()->json(['success' => false, 'message' => 'Email atau password salah'], 401);
        }

        RateLimiter::clear($throttleKey);
        $token = $user->createToken('auth_token')->plainTextToken;

        return (new UserResource($user))->additional([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'token' => $token
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logged out successfully'], 200);
    }

    public function me(Request $request)
    {
        return (new UserResource($request->user()))->additional([
            'success' => true
        ]);
    }
}
