<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\TalentRelative;

class TalentRelativeType extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function relatives()
    {
        return $this->belongsTo(TalentRelative::class);
    }
}
