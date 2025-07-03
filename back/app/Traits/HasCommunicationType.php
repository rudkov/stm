<?php

namespace App\Traits;

use App\Models\CommunicationType;

trait HasCommunicationType
{
    /**
     * Get the communication type.
     */
    public function type()
    {
        return $this->belongsTo(CommunicationType::class, 'communication_type_id');
    }
}
