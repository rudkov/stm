<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Weblink extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'info',
        'weblinkable_id',
        'weblinkable_type',
    ];

    /**
     * Get the owning weblinkable model (talent, user, company, contact, etc.).
     */
    public function weblinkable()
    {
        return $this->morphTo();
    }
}
