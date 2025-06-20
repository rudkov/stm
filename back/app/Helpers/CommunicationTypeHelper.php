<?php

namespace App\Helpers;

class CommunicationTypeHelper
{
    /**
     * Get the mapping between API request/response keys and database type values.
     */
    public static function getTypeMapping(): array
    {
        return [
            'email_types' => 'email',
            'phone_types' => 'phone',
            'address_types' => 'address'
        ];
    }
}
