<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Services\TeamInitializationService;

use App\Models\User;
use App\Models\TalentBoard;
use App\Models\CommunicationType;

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

    public function talentBoards()
    {
        return $this->hasMany(TalentBoard::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
