<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\CommunicationType;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Event;
use App\Models\EventChunk;
use App\Models\Talent;
use App\Models\TalentBoard;
use App\Models\User;

use App\Traits\HasUserTracking;

class Team extends Model
{
    use HasFactory;
    use SoftDeletes;

    use HasUserTracking;

    protected $hidden = [
        'id',
    ];

    protected $fillable = [
        'name',
    ];

    public function communicationTypes()
    {
        return $this->hasMany(CommunicationType::class);
    }

    public function companies()
    {
        return $this->hasMany(Company::class);
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function eventChunks()
    {
        return $this->hasMany(EventChunk::class);
    }

    public function talents()
    {
        return $this->hasMany(Talent::class);
    }

    public function talentBoards()
    {
        return $this->hasMany(TalentBoard::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
