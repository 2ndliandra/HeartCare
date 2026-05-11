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
        $user = Auth::user();
        if ($user) {
            $user->load('roles'); // Ensure roles are loaded
        }

        $userData = $user->toArray();
        $userData['roles'] = $user->roles->pluck('name');

        return response()->json([
            'success' => true,
            'data' => $userData
        ]);
    }

    /**
     * Update user profile identity and picture
     */
    public function update(Request $request)
    {
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
        ]);

        $user->name = $request->name;
        $user->phone_number = $request->phone_number;
        $user->gender = $request->gender;
        $user->address = $request->address;
        $user->birth_date = $request->birth_date;

        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            $path = $request->file('profile_picture')->store('profiles', 'public');
            $user->profile_picture = $path;
        }

        $user->save();
        $user->load('roles');

        $userData = $user->toArray();
        $userData['roles'] = $user->roles->pluck('name');

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $userData
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = \App\Models\User::find(Auth::id());

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully'
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
