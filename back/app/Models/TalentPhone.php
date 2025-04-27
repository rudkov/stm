<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TalentPhone extends Model
{
    use HasFactory;

    public function talents()
    {
        return $this->belongsTo(Talent::class);
    }

    public function type()
    {
        return $this->hasOne(PhoneType::class, 'id', 'phone_type_id');
    }
}
