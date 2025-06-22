<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\HasCommunicationType;

class Phone extends Model
{
    use HasFactory, HasCommunicationType;

    public $timestamps = false;

    protected $fillable = [
        'info',
        'communication_type_id',
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
}
