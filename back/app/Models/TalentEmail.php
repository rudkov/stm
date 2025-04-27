<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TalentEmail extends Model
{
    use HasFactory;

    public function talents()
    {
        return $this->belongsTo(Talent::class);
    }

    public function type()
    {
        return $this->hasOne(EmailType::class, 'id', 'email_type_id');
    }
}
