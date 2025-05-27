<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Talent;
use App\Models\User;

class TalentBoard extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function talents()
    {
        return $this->hasMany(Talent::class);
    }
}
