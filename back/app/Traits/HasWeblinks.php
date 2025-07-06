<?php

namespace App\Traits;

use App\Models\Weblink;

trait HasWeblinks
{
    /**
     * Get all weblinks for this model.
     */
    public function weblinks()
    {
        return $this->morphMany(Weblink::class, 'weblinkable');
    }
}
