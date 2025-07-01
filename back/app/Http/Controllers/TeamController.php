<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\TeamInitializationService;

class TeamController extends Controller
{
    public function store(Request $request)
    {
        $auth = Auth::user();

        if (is_null($auth->team_id)) {

            $user = null;

            DB::transaction(function () use ($request, $auth, &$user) {
                $team = Team::create($request->all());
                TeamInitializationService::run($team);

                $user = User::where('id', $auth->id)
                    ->firstOrFail();

                $user->team_id = $team->id;
                $user->save();
            });

            return response()->json($user, 201);
        }

        return false;
    }
}
