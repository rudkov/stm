<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::where('team_id', Auth::user()->team->id)
            ->orderBy('name', 'asc')
            ->get();

        return $companies;
    }
}
