<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;
use App\Models\PasswordReset;
use App\Notifications\ResetPasswordNotification;

class ResetPasswordController extends Controller
{
    /**
     * Send a password reset link to the given user.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Return success anyway to prevent email enumeration
            return response()->json(['success' => true, 'message' => 'If your email is in our database, a password reset link has been sent.']);
        }

        $token = Str::random(60);

        PasswordReset::where('email', $user->email)->delete();

        PasswordReset::create([
            'email' => $user->email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now()
        ]);

        $user->notify(new ResetPasswordNotification($token));

        return response()->json(['success' => true, 'message' => 'Password reset link has been sent to your email.']);
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
                'message' => 'Invalid or expired password reset token.'
            ], 422);
        }

        // Check expiration (e.g. 60 minutes)
        $createdAt = Carbon::parse($resetRecord->created_at);
        if ($createdAt->addMinutes(60)->isPast()) {
            PasswordReset::where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Password reset token has expired.'
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'We can\'t find a user with that email address.'
            ], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        PasswordReset::where('email', $request->email)->delete();

        return response()->json(['success' => true, 'message' => 'Your password has been reset successfully!']);
    }
}
