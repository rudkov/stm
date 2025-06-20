<?php

namespace App\Services;

use App\Models\Team;

class TeamInitializationService
{
    /**
     * Create default talent boards for a team.
     * 
     * @param Team $team
     * @param int|null $userId User ID to use as creator (optional)
     * @return void
     */
    public function createDefaultTalentBoards(Team $team, ?int $userId = null): void
    {
        $defaultBoards = config('defaults.talent_boards', []);

        foreach ($defaultBoards as $board) {
            $team->talentBoards()->create([
                'name' => $board['name'],
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);
        }
    }

    /**
     * Create default communication types for a team.
     * 
     * @param Team $team
     * @param int|null $userId User ID to use as creator (optional)
     * @return void
     */
    public function createDefaultCommunicationTypes(Team $team): void
    {
        $defaultCommunicationTypes = config('defaults.communication_types', []);

        foreach ($defaultCommunicationTypes as $type => $typeData) {
            foreach ($typeData as $item) {
                $team->communicationTypes()->create([
                    'name' => $item['name'],
                    'type' => $type,
                    'weight' => $item['weight'],
                    'team_id' => $team->id,
                ]);
            }
        }
    }
}
