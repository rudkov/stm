<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\App;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\AuthenticatesUsers;


class LoginController extends Controller
{
    use AuthenticatesUsers;

    public function __construct()
    {
        if (App::runningUnitTests()) {
            $this->middleware('web');
        }
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