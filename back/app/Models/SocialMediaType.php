<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\SocialMedia;

class SocialMediaType extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function socialMedias()
    {
        return $this->belongsTo(SocialMedia::class);
    }
}
