<?php

namespace App\Observers;

use App\Models\Team;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;

class TeamObserver
{
    /**
     * Handle the Team "created" event.
     */
    public function created(Team $team): void
    {
        $defaultBoards = Config::get('defaults.talent_boards', []);
        $userId = Auth::id();

        foreach ($defaultBoards as $board) {
            $team->talentBoards()->create([
                'name' => $board['name'],
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);
        }
    }

    /**
     * Handle the Team "updated" event.
     */
    public function updated(Team $team): void
    {
        //
    }

    /**
     * Handle the Team "deleted" event.
     */
    public function deleted(Team $team): void
    {
        //
    }

    /**
     * Handle the Team "restored" event.
     */
    public function restored(Team $team): void
    {
        //
    }

    /**
     * Handle the Team "force deleted" event.
     */
    public function forceDeleted(Team $team): void
    {
        //
    }
}
