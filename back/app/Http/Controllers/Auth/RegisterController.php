<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    protected function createAndAuthenticate(RegisterRequest $request)
    {
        $validated = $request->validated();
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (Auth::attempt([
            'email' => $validated['email'],
            'password' => $validated['password']
        ], true)) {
            $request->session()->regenerate();
            return 'true';
        }
        
        return 'false';
    }
}
