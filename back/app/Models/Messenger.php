<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Messenger extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'info',
        'messenger_type_id',
        'messengerable_id',
        'messengerable_type',
    ];

    /**
     * Get the owning messengerable model (talent, user, company, contact, etc.).
     */
    public function messengerable()
    {
        return $this->morphTo();
    }

    /**
     * Get the messenger type.
     */
    public function type()
    {
        return $this->belongsTo(MessengerType::class, 'messenger_type_id');
    }
}
