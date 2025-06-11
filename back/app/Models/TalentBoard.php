<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Talent;

use App\Traits\HasUserTracking;

class TalentBoard extends Model
{
    use HasFactory;
    use SoftDeletes;

    use HasUserTracking;

    protected $fillable = [
        'name',
    ];

    public function talents()
    {
        return $this->hasMany(Talent::class);
    }
}
