<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TalentSocialMedia extends Model
{
    use HasFactory;

    public function talents()
    {
        return $this->belongsTo(Talent::class);
    }

    public function type()
    {
        return $this->hasOne(SocialMediaType::class, 'id', 'social_media_type_id');
    }
}
