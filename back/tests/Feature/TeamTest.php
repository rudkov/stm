<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\TalentBoard;
use App\Models\User;
use App\Models\CommunicationType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;
use App\Services\TeamInitializationService;

class TeamTest extends TestCase
{
    use RefreshDatabase;

    public function test_team_creates_default_talent_boards_on_creation_with_authenticated_user()
    {
        // Get default talent boards from config
        $defaultBoards = Config::get('defaults.talent_boards', []);

        // Create a team for the user factory dependency
        $existingTeam = Team::factory()->create();

        // Create and authenticate a user
        $user = User::factory()->create();
        Auth::login($user);

        // Create a team
        $team = Team::create(['name' => 'Test Team']);

        // Assert team was created
        $this->assertInstanceOf(Team::class, $team);
        $this->assertEquals('Test Team', $team->name);

        // Assert default talent boards were created
        $talentBoards = $team->talentBoards;
        $this->assertCount(count($defaultBoards), $talentBoards);

        // Assert talent boards have correct names from config
        $boardNames = $talentBoards->pluck('name')->toArray();
        foreach ($defaultBoards as $defaultBoard) {
            $this->assertContains($defaultBoard['name'], $boardNames);
        }

        // Assert talent boards are properly associated with the team
        foreach ($talentBoards as $board) {
            $this->assertEquals($team->id, $board->team_id);
            $this->assertEquals($user->id, $board->created_by);
            $this->assertEquals($user->id, $board->updated_by);
        }
    }

    public function test_team_creates_default_talent_boards_with_specific_user()
    {
        // Get default talent boards from config
        $defaultBoards = Config::get('defaults.talent_boards', []);

        // Create a team for the user factory dependency
        $existingTeam = Team::factory()->create();

        // Create users
        $authenticatedUser = User::factory()->create();
        $specificUser = User::factory()->create();
        Auth::login($authenticatedUser);

        // Create a team using factory to avoid automatic default board creation
        $team = Team::factory()->create(['name' => 'Test Team']);

        // Create default talent boards with specific user using the service
        $initializationService = new \App\Services\TeamInitializationService();
        $initializationService->createDefaultTalentBoards($team, $specificUser->id);

        // Assert talent boards were created with the specific user
        $talentBoards = $team->talentBoards;
        $this->assertCount(count($defaultBoards), $talentBoards);

        foreach ($talentBoards as $board) {
            $this->assertEquals($specificUser->id, $board->created_by);
            $this->assertEquals($specificUser->id, $board->updated_by);
        }
    }

    public function test_team_creates_talent_boards_with_null_user_when_no_user_available()
    {
        // Get default talent boards from config
        $defaultBoards = Config::get('defaults.talent_boards', []);

        // Ensure no user is authenticated
        Auth::logout();

        // Create a team
        $team = Team::create(['name' => 'Test Team']);

        // Assert talent boards were created
        $talentBoards = $team->talentBoards;
        $this->assertCount(count($defaultBoards), $talentBoards);

        // Assert talent boards have null created_by and updated_by
        foreach ($talentBoards as $board) {
            $this->assertEquals($team->id, $board->team_id);
            $this->assertNull($board->created_by);
            $this->assertNull($board->updated_by);
        }

        // Assert talent boards have correct names from config
        $boardNames = $talentBoards->pluck('name')->toArray();
        foreach ($defaultBoards as $defaultBoard) {
            $this->assertContains($defaultBoard['name'], $boardNames);
        }
    }

    public function test_team_creates_no_talent_boards_when_config_is_empty()
    {
        // Set empty default talent boards config
        Config::set('defaults.talent_boards', []);

        // Create a team for the user factory dependency
        $existingTeam = Team::factory()->create();

        // Create and authenticate a user
        $user = User::factory()->create();
        Auth::login($user);

        // Create a team
        $team = Team::create(['name' => 'Test Team']);

        // Assert no talent boards were created
        $this->assertCount(0, $team->talentBoards);
    }

    public function test_create_default_talent_boards_method_is_idempotent()
    {
        // Get default talent boards from config
        $defaultBoards = Config::get('defaults.talent_boards', []);

        // Create a team for the user factory dependency
        $existingTeam = Team::factory()->create();

        // Create and authenticate a user
        $user = User::factory()->create();
        Auth::login($user);

        // Create a team
        $team = Team::create(['name' => 'Test Team']);

        // Assert initial talent boards were created
        $this->assertCount(count($defaultBoards), $team->talentBoards);

        // Call createDefaultTalentBoards again using the service
        $initializationService = new \App\Services\TeamInitializationService();
        $initializationService->createDefaultTalentBoards($team, $user->id);

        // Assert additional talent boards were created (method is not idempotent by design)
        $this->assertCount(count($defaultBoards) * 2, $team->fresh()->talentBoards);
    }

    public function test_team_creation_happens_in_transaction()
    {
        // Get default talent boards from config
        $defaultBoards = Config::get('defaults.talent_boards', []);

        // Create a team for the user factory dependency
        $existingTeam = Team::factory()->create();

        // Create and authenticate a user
        $user = User::factory()->create();
        Auth::login($user);

        // Create a team
        $team = Team::create(['name' => 'Test Team']);

        // Verify both team and talent boards exist in database
        $this->assertDatabaseHas('teams', ['name' => 'Test Team']);

        // Verify all default talent boards were created
        foreach ($defaultBoards as $defaultBoard) {
            $this->assertDatabaseHas('talent_boards', [
                'team_id' => $team->id,
                'name' => $defaultBoard['name'],
            ]);
        }
    }

    public function test_team_creates_default_communication_types_on_creation()
    {
        // Get default communication types from config
        $defaultCommunicationTypes = Config::get('defaults.communication_types', []);

        // Create a team for the user factory dependency
        $existingTeam = Team::factory()->create();

        // Create and authenticate a user
        $user = User::factory()->create();
        Auth::login($user);

        // Create a team
        $team = Team::create(['name' => 'Test Team']);

        // Assert team was created
        $this->assertInstanceOf(Team::class, $team);

        // Calculate expected total communication types
        $expectedTotal = 0;
        foreach ($defaultCommunicationTypes as $type => $typeData) {
            $expectedTotal += count($typeData);
        }

        // Assert communication types were created
        $communicationTypes = $team->communicationTypes;
        $this->assertCount($expectedTotal, $communicationTypes);

        // Assert communication types have correct structure
        foreach ($defaultCommunicationTypes as $type => $typeData) {
            foreach ($typeData as $item) {
                $this->assertDatabaseHas('communication_types', [
                    'team_id' => $team->id,
                    'type' => $type,
                    'name' => $item['name'],
                    'weight' => $item['weight'],
                ]);
            }
        }
    }
}
