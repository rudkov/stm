<?php

namespace App\Traits;

use App\Models\Messenger;

trait HasMessengers
{
    /**
     * Get all messengers for this model.
     */
    public function messengers()
    {
        return $this->morphMany(Messenger::class, 'messengerable');
    }
}
