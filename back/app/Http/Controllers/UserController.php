<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('name', 'asc')
            ->where('team_id', Auth::user()->team_id)
            ->get(['id', 'name']);

        return $users;
    }
}
