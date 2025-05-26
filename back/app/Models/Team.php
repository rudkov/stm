<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\User;
use App\Models\TalentBoard;

class Team extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $hidden = [
        'id',
    ];

    protected $fillable = [
        'name',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function talentBoards()
    {
        return $this->hasMany(TalentBoard::class);
    }
}
