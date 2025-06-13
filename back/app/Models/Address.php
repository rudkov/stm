<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'info',
        'address_type_id',
        'addressable_id',
        'addressable_type',
    ];

    /**
     * Get the owning addressable model (talent, user, company, etc.).
     */
    public function addressable()
    {
        return $this->morphTo();
    }

    /**
     * Get the address type.
     */
    public function type()
    {
        return $this->belongsTo(AddressType::class, 'address_type_id');
    }
}
