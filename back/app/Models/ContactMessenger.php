<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessenger extends Model
{
    use HasFactory;

    public function contacts()
    {
        return $this->belongsTo(Contact::class);
    }

    public function type()
    {
        return $this->hasOne(MessengerType::class, 'id', 'messenger_type_id');
    }
}
