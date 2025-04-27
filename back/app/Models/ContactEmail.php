<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactEmail extends Model
{
    use HasFactory;

    public function contacts()
    {
        return $this->belongsTo(Contact::class);
    }

    public function type()
    {
        return $this->hasOne(EmailType::class, 'id', 'email_type_id');
    }
}
