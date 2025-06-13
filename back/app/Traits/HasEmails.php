<?php

namespace App\Traits;

use App\Models\Email;

trait HasEmails
{
    /**
     * Get all emails for this model.
     */
    public function emails()
    {
        return $this->morphMany(Email::class, 'emailable');
    }
}
