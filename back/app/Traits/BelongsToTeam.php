<?php

namespace App\Traits;

use App\Models\Team;

trait BelongsToTeam
{
    /**
     * Get the team that owns this model.
     */
    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
