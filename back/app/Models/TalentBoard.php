<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Talent;

use App\Traits\BelongsToTeam;
use App\Traits\HasUserTracking;

class TalentBoard extends Model
{
    use HasFactory;
    use SoftDeletes;

    use BelongsToTeam;
    use HasUserTracking;

    protected $fillable = [
        'name',
        'created_by',
        'updated_by',
    ];

    public function talents()
    {
        return $this->hasMany(Talent::class);
    }
}
