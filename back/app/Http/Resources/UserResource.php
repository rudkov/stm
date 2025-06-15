<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Return teaser user data (id and name) for the given user.
     *
     * @param mixed $user - User model
     * @return array
     */
    public static function basic($user): ?array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
        ];
    }
}
