<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TalentAddress extends Model
{
    use HasFactory;

    public function talents()
    {
        return $this->belongsTo(Talent::class);
    }

    public function type()
    {
        return $this->hasOne(AddressType::class, 'id', 'address_type_id');
    }
}
