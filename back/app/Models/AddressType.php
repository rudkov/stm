<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Address;

class AddressType extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function addresses()
    {
        return $this->belongsTo(Address::class);
    }
}
