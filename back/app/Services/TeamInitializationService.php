<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

use App\Models\Team;

class TeamInitializationService
{
    private Team $team;

    /**
     * Initialize the team initialization service.
     * 
     * @param Team $team
     */
    public function __construct(Team $team)
    {
        $this->team = $team;
    }

    /**
     * Run the team initialization service.
     * 
     * @param Team $team
     * @return void
     */
    public static function run(Team $team)
    {
        DB::transaction(function () use ($team) {
            $initializationService = new TeamInitializationService($team);
            $initializationService->createDefaultTalentBoards();
            $initializationService->createDefaultCommunicationTypes();
        });
    }

    /**
     * Create default talent boards for a team.
     * 
     * @return void
     */
    public function createDefaultTalentBoards(): void
    {
        $defaultBoards = config('defaults.talent_boards', []);

        DB::transaction(function () use ($defaultBoards) {
            foreach ($defaultBoards as $board) {
                $this->team->talentBoards()->create([
                    'name' => $board['name'],
                ]);
            }
        });
    }

    /**
     * Create default communication types for a team.
     * 
     * @return void
     */
    public function createDefaultCommunicationTypes(): void
    {
        $defaultCommunicationTypes = config('defaults.communication_types', []);

        DB::transaction(function () use ($defaultCommunicationTypes) {
            foreach ($defaultCommunicationTypes as $type => $typeData) {
                foreach ($typeData as $item) {
                    $this->team->communicationTypes()->create([
                        'name' => $item['name'],
                        'type' => $type,
                        'sort_order' => $item['sort_order'],
                        'team_id' => $this->team->id,
                    ]);
                }
            }
        });
    }
}
