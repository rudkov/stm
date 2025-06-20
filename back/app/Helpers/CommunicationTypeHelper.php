<?php

namespace App\Helpers;

class CommunicationTypeHelper
{
    /**
     * Get the list of communication types used in the database.
     */
    public static function getTypes(): array
    {
        return [
            'address',
            'email',
            'phone'
        ];
    }
}
