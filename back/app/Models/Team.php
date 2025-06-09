<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
            $team->createDefaultTalentBoards();
            return $team;
        });
    }

    /**
     * Create default talent boards for this team.
     * 
     * @param int|null $userId Optional user ID to use as creator
     * @return void
     */
    public function createDefaultTalentBoards($userId = null): void
    {
        $defaultBoards = config('defaults.talent_boards', []);
        
        if (!$userId) {
            $userId = Auth::id();
        }

        // Skip creating talent boards if no user is available
        if (!$userId) {
            return;
        }

        foreach ($defaultBoards as $board) {
            $this->talentBoards()->create([
                'name' => $board['name'],
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);
        }
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function talentBoards()
    {
        return $this->hasMany(TalentBoard::class);
    }
}
