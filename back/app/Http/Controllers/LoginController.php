<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return Auth::user();
        }
        
        return response()->json([
            'message' => 'Authentication failed',
            'errors' => ['password' => ['Incorrect email or password']]
        ], 422);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        return response()->json(['success' => true]);
    }

    public function isLoggedIn()
    {
        $user = Auth::user();
        return response()->json([
            'is_authenticated' => !is_null($user),
            'user' => $user
        ]);
    }
}