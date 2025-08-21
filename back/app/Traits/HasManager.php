<?php

namespace App\Traits;

use App\Models\User;

trait HasManager
{
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }
}
