<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('name', 'asc')
            ->where('team_id', Auth::user()->team->id)
            ->get(['id', 'name']);

        return $users;
    }
}
