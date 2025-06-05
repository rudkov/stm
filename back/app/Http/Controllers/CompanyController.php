<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Http\Resources\CompanyCollection;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::where('team_id', Auth::user()->team->id)
            ->orderBy('name', 'asc')
            ->get();

        return new CompanyCollection($companies);
    }
}
