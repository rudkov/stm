<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Talent  $talent
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Event $event)
    {
        return $user->team->id === $event->team_id;
    }
}
