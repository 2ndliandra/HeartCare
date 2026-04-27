<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Display the current user's profile.
     */
    public function show()
    {
        return response()->json([
            'success' => true,
            'data' => Auth::user()
        ]);
    }

    /**
     * Update user profile identity and picture
     */
    public function update(Request $request)
    {
        // Fetch fresh user instance from DB
        $user = \App\Models\User::find(Auth::id());

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'gender' => 'nullable|string|in:L,P',
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Update fields
        $user->name = $request->name;
        $user->phone_number = $request->phone_number;
        $user->gender = $request->gender;
        $user->address = $request->address;
        $user->birth_date = $request->birth_date;

        // Only update password if it's explicitly provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('profile_picture')) {
            // Delete old picture if exists
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            $path = $request->file('profile_picture')->store('profiles', 'public');
            $user->profile_picture = $path;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui',
            'data' => $user
        ]);
    }

    /**
     * Remove the current user's account.
     */
    public function destroy()
    {
        $user = \App\Models\User::find(Auth::id());

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        // Delete profile picture if exists
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Revoke all tokens
        $user->tokens()->delete();

        // Delete user
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil dihapus'
        ]);
    }
}
