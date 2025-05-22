<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactPhone extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'phone_type_id',
        'info',
    ];

    public function contacts()
    {
        return $this->belongsTo(Contact::class);
    }

    public function type()
    {
        return $this->hasOne(PhoneType::class, 'id', 'phone_type_id');
    }
}
