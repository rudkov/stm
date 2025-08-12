<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Talent;

class TalentRelative extends Model
{
    use HasFactory;

    protected $fillable = [
        'info',
        'talent_id'
    ];

    public function talents()
    {
        return $this->belongsTo(Talent::class);
    }
}
