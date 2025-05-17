<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LocationController extends Controller
{
    public function index()
    {
        $uniqueLocations = DB::table('talents')
            ->select('current_location')
            ->where('team_id', Auth::user()->team->id)
            ->whereNull('talents.deleted_at')
            ->distinct()
            ->orderByRaw('CASE WHEN current_location IS NULL THEN 0 ELSE 1 END, current_location')
            ->pluck('current_location');
        return $uniqueLocations;
    }
}
