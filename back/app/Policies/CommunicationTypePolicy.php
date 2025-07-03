<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommunicationTypePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any communication types.
     */
    public function viewAny(User $user): bool
    {
        return $user->team_id !== null;
    }

    /**
     * Determine whether the user can update communication types.
     */
    public function update(User $user): bool
    {
        return $user->team_id !== null;
    }
}
