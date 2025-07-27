<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\TeamInitializationService;
use App\Http\Requests\StoreTeamRequest;

class TeamController extends Controller
{
    public function store(StoreTeamRequest $request)
    {
        $auth = Auth::user();

        $user = null;

        DB::transaction(function () use ($request, $auth, &$user) {
            // Lock the user row for update
            $user = User::where('id', $auth->id)->lockForUpdate()->firstOrFail();

            // Check if user already has a team
            if ($user->team_id) {
                abort(response()->json($user, 201));
            }

            $team = Team::create($request->validated());
            TeamInitializationService::run($team);

            $user->team_id = $team->id;
            $user->save();
        });

        return response()->json($user, 201);
    }
}
