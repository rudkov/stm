<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunicationType extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'type',
        'weight',
        'team_id',
    ];

    /**
     * Get the team that owns this communication type.
     */
    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
