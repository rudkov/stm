<?php

namespace App\Policies;

use App\Models\User;
use App\Models\TalentBoard;
use Illuminate\Auth\Access\HandlesAuthorization;

class TalentBoardPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any talent boards.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the talent board.
     */
    public function view(User $user, TalentBoard $talentBoard): bool
    {
        return $user->team->id === $talentBoard->team_id;
    }

    /**
     * Determine whether the user can create talent boards.
     */
    public function create(User $user): bool
    {
        return $user->team_id !== null;
    }

    /**
     * Determine whether the user can update the talent board.
     */
    public function update(User $user, TalentBoard $talentBoard): bool
    {
        return $user->team->id === $talentBoard->team_id;
    }

    /**
     * Determine whether the user can delete the talent board.
     */
    public function delete(User $user, TalentBoard $talentBoard): bool
    {
        return $user->team->id === $talentBoard->team_id;
    }

    /**
     * Determine whether the user can restore the talent board.
     */
    public function restore(User $user, TalentBoard $talentBoard): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the talent board.
     */
    public function forceDelete(User $user, TalentBoard $talentBoard): bool
    {
        return false;
    }
}
