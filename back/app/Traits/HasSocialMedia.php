<?php

namespace App\Traits;

use App\Models\SocialMedia;

trait HasSocialMedia
{
    /**
     * Get all social media for this model.
     */
    public function socialMedias()
    {
        return $this->morphMany(SocialMedia::class, 'social_mediaable');
    }
}
