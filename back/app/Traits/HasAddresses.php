<?php

namespace App\Traits;

use App\Models\Address;

trait HasAddresses
{
    /**
     * Get all addresses for this model.
     */
    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }
}
