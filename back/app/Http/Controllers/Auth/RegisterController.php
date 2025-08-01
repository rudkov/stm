<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Events\Registered;

class RegisterController extends Controller
{
    protected function createAndAuthenticate(RegisterRequest $request)
    {
        $validated = $request->validated();
        
        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            
            DB::afterCommit(function () use ($user) {
                event(new Registered($user));
            });
        });

        if (Auth::attempt([
            'email' => $validated['email'],
            'password' => $validated['password']
        ], true)) {
            $request->session()->regenerate();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false]);
    }
}
