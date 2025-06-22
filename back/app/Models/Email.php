<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\HasCommunicationType;

class Email extends Model
{
    use HasFactory, HasCommunicationType;

    public $timestamps = false;

    protected $fillable = [
        'info',
        'communication_type_id',
        'emailable_id',
        'emailable_type',
    ];

    /**
     * Get the owning emailable model (talent, user, company, contact, etc.).
     */
    public function emailable()
    {
        return $this->morphTo();
    }
}
