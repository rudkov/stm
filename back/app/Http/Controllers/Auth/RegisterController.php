<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    protected function createAndAuthenticate(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email:rfc', 'max:255', 'unique:users'],
        ]);

        $random = str_shuffle('abcdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ234567890!$%^&!$%^&');
        $password = substr($random, 0, 20);
        
        User::create([
            'email' => $request['email'],
            'password' => Hash::make($password),
        ]);

        $credentials = [
            'email' => $request['email'],
            'password' => $password,
        ];

        if (Auth::attempt($credentials,true)) {
            $request->session()->regenerate();
            return 'true';
        }
        
        return 'false';
    }
}
