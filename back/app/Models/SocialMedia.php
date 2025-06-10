<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialMedia extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'info',
        'social_media_type_id',
        'social_mediaable_id',
        'social_mediaable_type',
    ];

    /**
     * Get the owning social_mediaable model (talent, user, company, contact, etc.).
     */
    public function socialMediaable()
    {
        return $this->morphTo();
    }

    /**
     * Get the social media type.
     */
    public function type()
    {
        return $this->belongsTo(SocialMediaType::class, 'social_media_type_id');
    }
}
