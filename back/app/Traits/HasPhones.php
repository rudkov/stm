<?php

namespace App\Traits;

use App\Models\Phone;

trait HasPhones
{
    /**
     * Get all phones for this model.
     */
    public function phones()
    {
        return $this->morphMany(Phone::class, 'phoneable');
    }
}
