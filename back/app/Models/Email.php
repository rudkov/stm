<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
    use HasFactory;

    protected $fillable = [
        'info',
        'email_type_id',
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

    /**
     * Get the email type.
     */
    public function type()
    {
        return $this->belongsTo(EmailType::class, 'email_type_id');
    }
}
