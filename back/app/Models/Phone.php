<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Phone extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'info',
        'phone_type_id',
        'phoneable_id',
        'phoneable_type',
    ];

    /**
     * Get the owning phoneable model (talent, user, company, etc.).
     */
    public function phoneable()
    {
        return $this->morphTo();
    }

    /**
     * Get the phone type.
     */
    public function type()
    {
        return $this->belongsTo(PhoneType::class, 'phone_type_id');
    }
}
