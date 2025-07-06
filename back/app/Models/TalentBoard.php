<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Talent;

use App\Traits\BelongsToTeam;

class TalentBoard extends Model
{
    use HasFactory;

    use BelongsToTeam;

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];

    public function talents()
    {
        return $this->hasMany(Talent::class);
    }
}
