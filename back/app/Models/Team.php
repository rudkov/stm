<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Services\TeamInitializationService;

use App\Models\CommunicationType;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Event;
use App\Models\EventChunk;
use App\Models\Talent;
use App\Models\TalentBoard;
use App\Models\User;

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

    /**
     * Create a new team with default talent boards in a transaction.
     * 
     * @param array $attributes
     * @return static
     */
    public static function create(array $attributes = [])
    {
        return DB::transaction(function () use ($attributes) {
            // Use query builder to avoid recursion
            $teamId = DB::table('teams')->insertGetId(array_merge($attributes, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));

            $team = static::find($teamId);

            $initializationService = new TeamInitializationService();
            $initializationService->createDefaultTalentBoards($team, Auth::id());
            $initializationService->createDefaultCommunicationTypes($team);

            return $team;
        });
    }

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
