<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TalentMessenger extends Model
{
    use HasFactory;

    public function talents()
    {
        return $this->belongsTo(Talent::class);
    }

    public function type()
    {
        return $this->hasOne(MessengerType::class, 'id', 'messenger_type_id');
    }
}
