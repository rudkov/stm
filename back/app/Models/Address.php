<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\HasCommunicationType;

class Address extends Model
{
    use HasFactory, HasCommunicationType;

    public $timestamps = false;

    protected $fillable = [
        'info',
        'communication_type_id',
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
}
