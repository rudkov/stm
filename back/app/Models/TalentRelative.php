<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Talent;
use App\Models\TalentRelativeType;

class TalentRelative extends Model
{
    use HasFactory;

    protected $fillable = [
        'info',
        'relative_type_id',
        'talent_id'
    ];

    public function talents()
    {
        return $this->belongsTo(Talent::class);
    }

    public function type()
    {
        return $this->hasOne(TalentRelativeType::class, 'id', 'relative_type_id');
    }
}
