<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use App\Models\User;
use App\Models\PasswordReset;
use App\Notifications\ResetPasswordNotification;

class ResetPasswordController extends Controller
{
    /**
     * Send a password reset link to the given user.
     * Updated to generate a 6-digit numeric OTP for better mobile/UX compatibility.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Return success anyway to prevent email enumeration
            return response()->json(['success' => true, 'message' => 'Jika email Anda terdaftar, kode reset telah dikirim.']);
        }

        // Generate 6-digit numeric OTP
        $token = (string) rand(100000, 999999);

        // Clear existing resets
        PasswordReset::where('email', $user->email)->delete();

        // Save token (hashing for security)
        PasswordReset::create([
            'email' => $user->email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now()
        ]);

        // Attempt to notify (will fail softly if mail is not configured)
        try {
            $user->notify(new ResetPasswordNotification($token));
        } catch (\Exception $e) {
            // Log error but continue for dev purposes
        }

        return response()->json([
            'success' => true, 
            'message' => 'Kode reset telah dikirim ke email Anda.',
            'debug_token' => $token // Returning token for development ease
        ]);
    }

    /**
     * Verify the 6-digit OTP token.
     */
    public function verifyToken(Request $request) 
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string|size:6'
        ]);

        $resetRecord = PasswordReset::where('email', $request->email)->first();

        if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode reset tidak valid atau sudah kedaluwarsa.'
            ], 422);
        }

        // Check expiration (60 mins)
        if (Carbon::parse($resetRecord->created_at)->addMinutes(60)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Kode reset telah kedaluwarsa.'
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode valid. Silakan lanjutkan ke perubahan password.'
        ]);
    }

    /**
     * Reset the given user's password.
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()
            ], 422);
        }

        $resetRecord = PasswordReset::where('email', $request->email)->first();

        if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi reset tidak valid.'
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        PasswordReset::where('email', $request->email)->delete();

        return response()->json(['success' => true, 'message' => 'Password berhasil diperbarui!']);
    }
}
