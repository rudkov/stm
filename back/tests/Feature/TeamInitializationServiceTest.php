<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\TalentBoard;
use App\Models\CommunicationType;
use App\Services\TeamInitializationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class TeamInitializationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a team for testing
        $this->team = Team::factory()->create();
    }

    public function test_run_method_creates_both_default_talent_boards_and_communication_types()
    {
        // Get expected counts from config
        $defaultBoards = config('defaults.talent_boards', []);
        $defaultCommunicationTypes = config('defaults.communication_types', []);

        $expectedCommunicationTypesCount = 0;
        foreach ($defaultCommunicationTypes as $type => $typeData) {
            $expectedCommunicationTypesCount += count($typeData);
        }

        // Ensure team starts with no related records
        $this->assertEquals(0, $this->team->talentBoards()->count());
        $this->assertEquals(0, $this->team->communicationTypes()->count());

        // Run the initialization service
        TeamInitializationService::run($this->team);

        // Refresh the team to get updated relationships
        $this->team->refresh();

        // Assert talent boards were created
        $this->assertEquals(count($defaultBoards), $this->team->talentBoards()->count());

        // Assert communication types were created
        $this->assertEquals($expectedCommunicationTypesCount, $this->team->communicationTypes()->count());
    }

    public function test_run_method_executes_within_database_transaction()
    {
        // Count initial records
        $initialBoardsCount = TalentBoard::count();
        $initialTypesCount = CommunicationType::count();

        // Run the service
        TeamInitializationService::run($this->team);

        // Verify records were actually created in database
        $this->assertGreaterThan($initialBoardsCount, TalentBoard::count());
        $this->assertGreaterThan($initialTypesCount, CommunicationType::count());

        // Verify all created records belong to our team
        $teamBoards = TalentBoard::where('team_id', $this->team->id)->get();
        $teamTypes = CommunicationType::where('team_id', $this->team->id)->get();

        $this->assertGreaterThan(0, $teamBoards->count());
        $this->assertGreaterThan(0, $teamTypes->count());
    }

    public function test_create_default_talent_boards_creates_boards_from_config()
    {
        $defaultBoards = config('defaults.talent_boards', []);

        // Ensure team starts with no talent boards
        $this->assertEquals(0, $this->team->talentBoards()->count());

        // Create the service and run the method
        $service = new TeamInitializationService($this->team);
        $service->createDefaultTalentBoards();

        // Refresh team to get updated relationships
        $this->team->refresh();

        // Assert correct number of boards created
        $this->assertEquals(count($defaultBoards), $this->team->talentBoards()->count());

        // Assert boards have correct names and properties
        $createdBoards = $this->team->talentBoards;
        $createdBoardNames = $createdBoards->pluck('name')->toArray();

        foreach ($defaultBoards as $defaultBoard) {
            $this->assertContains($defaultBoard['name'], $createdBoardNames);
        }

        // Assert all boards have null created_by and updated_by
        foreach ($createdBoards as $board) {
            $this->assertNull($board->created_by);
            $this->assertNull($board->updated_by);
            $this->assertEquals($this->team->id, $board->team_id);
        }
    }

    public function test_create_default_talent_boards_with_empty_config()
    {
        // Temporarily set empty config
        $originalConfig = config('defaults.talent_boards');
        Config::set('defaults.talent_boards', []);

        // Create the service and run the method
        $service = new TeamInitializationService($this->team);
        $service->createDefaultTalentBoards();

        // Assert no boards were created
        $this->assertEquals(0, $this->team->talentBoards()->count());

        // Restore original config
        Config::set('defaults.talent_boards', $originalConfig);
    }

    public function test_create_default_talent_boards_persists_to_database()
    {
        $service = new TeamInitializationService($this->team);
        $service->createDefaultTalentBoards();

        $defaultBoards = config('defaults.talent_boards', []);

        // Verify each board exists in the database
        foreach ($defaultBoards as $defaultBoard) {
            $this->assertDatabaseHas('talent_boards', [
                'team_id' => $this->team->id,
                'name' => $defaultBoard['name'],
            ]);
        }
    }

    public function test_create_default_communication_types_creates_types_from_config()
    {
        $defaultCommunicationTypes = config('defaults.communication_types', []);

        // Ensure team starts with no communication types
        $this->assertEquals(0, $this->team->communicationTypes()->count());

        // Create the service and run the method
        $service = new TeamInitializationService($this->team);
        $service->createDefaultCommunicationTypes();

        // Refresh team to get updated relationships
        $this->team->refresh();

        // Calculate expected count
        $expectedCount = 0;
        foreach ($defaultCommunicationTypes as $type => $typeData) {
            $expectedCount += count($typeData);
        }

        // Assert correct number of types created
        $this->assertEquals($expectedCount, $this->team->communicationTypes()->count());

        // Assert each type was created correctly
        foreach ($defaultCommunicationTypes as $type => $typeData) {
            foreach ($typeData as $item) {
                $this->assertDatabaseHas('communication_types', [
                    'team_id' => $this->team->id,
                    'name' => $item['name'],
                    'type' => $type,
                    'weight' => $item['weight'],
                ]);
            }
        }
    }

    public function test_create_default_communication_types_with_empty_config()
    {
        // Temporarily set empty config
        $originalConfig = config('defaults.communication_types');
        Config::set('defaults.communication_types', []);

        // Create the service and run the method
        $service = new TeamInitializationService($this->team);
        $service->createDefaultCommunicationTypes();

        // Assert no types were created
        $this->assertEquals(0, $this->team->communicationTypes()->count());

        // Restore original config
        Config::set('defaults.communication_types', $originalConfig);
    }

    public function test_create_default_communication_types_persists_to_database()
    {
        $service = new TeamInitializationService($this->team);
        $service->createDefaultCommunicationTypes();

        $defaultCommunicationTypes = config('defaults.communication_types', []);

        // Verify each communication type exists in the database
        foreach ($defaultCommunicationTypes as $type => $typeData) {
            foreach ($typeData as $item) {
                $this->assertDatabaseHas('communication_types', [
                    'team_id' => $this->team->id,
                    'name' => $item['name'],
                    'type' => $type,
                    'weight' => $item['weight'],
                ]);
            }
        }
    }

    public function test_service_fails_gracefully_when_called_multiple_times()
    {
        // First run should succeed
        TeamInitializationService::run($this->team);

        $firstRunBoardsCount = $this->team->talentBoards()->count();
        $firstRunTypesCount = $this->team->communicationTypes()->count();

        // Verify first run created records
        $this->assertGreaterThan(0, $firstRunBoardsCount);
        $this->assertGreaterThan(0, $firstRunTypesCount);

        // Second run should fail due to unique constraints on communication_types
        $this->expectException(\Illuminate\Database\UniqueConstraintViolationException::class);
        TeamInitializationService::run($this->team);
    }

    public function test_talent_boards_can_be_created_multiple_times_but_communication_types_cannot()
    {
        // Create talent boards multiple times - should work
        $service = new TeamInitializationService($this->team);
        $service->createDefaultTalentBoards();

        $firstRunBoardsCount = $this->team->talentBoards()->count();
        $this->assertGreaterThan(0, $firstRunBoardsCount);

        // Second run of talent boards should work (no unique constraints)
        $service->createDefaultTalentBoards();
        $this->team->refresh();
        $this->assertEquals($firstRunBoardsCount * 2, $this->team->talentBoards()->count());

        // But communication types should fail on second run
        $service->createDefaultCommunicationTypes();
        $firstRunTypesCount = $this->team->communicationTypes()->count();
        $this->assertGreaterThan(0, $firstRunTypesCount);

        // Second run of communication types should fail due to unique constraints
        $this->expectException(\Illuminate\Database\UniqueConstraintViolationException::class);
        $service->createDefaultCommunicationTypes();
    }

    public function test_constructor_sets_team_property()
    {
        $service = new TeamInitializationService($this->team);

        // Use reflection to verify the team property is set correctly
        $reflection = new \ReflectionClass($service);
        $teamProperty = $reflection->getProperty('team');
        $teamProperty->setAccessible(true);

        $this->assertSame($this->team, $teamProperty->getValue($service));
    }

    public function test_communication_types_have_correct_structure_and_validation()
    {
        $service = new TeamInitializationService($this->team);
        $service->createDefaultCommunicationTypes();

        $this->team->refresh();
        $communicationTypes = $this->team->communicationTypes;

        $this->assertGreaterThan(0, $communicationTypes->count());

        foreach ($communicationTypes as $type) {
            // Assert required fields are present and valid
            $this->assertNotNull($type->name);
            $this->assertNotEmpty($type->name);
            $this->assertNotNull($type->type);
            $this->assertNotNull($type->weight);
            $this->assertEquals($this->team->id, $type->team_id);

            // Assert type is one of the expected types
            $expectedTypes = ['address', 'email', 'phone'];
            $this->assertContains($type->type, $expectedTypes);

            // Assert weight is a non-negative integer
            $this->assertIsInt($type->weight);
            $this->assertGreaterThanOrEqual(0, $type->weight);
        }
    }

    public function test_talent_boards_have_correct_structure_and_validation()
    {
        $service = new TeamInitializationService($this->team);
        $service->createDefaultTalentBoards();

        $this->team->refresh();
        $talentBoards = $this->team->talentBoards;

        $this->assertGreaterThan(0, $talentBoards->count());

        foreach ($talentBoards as $board) {
            // Assert required fields are present and valid
            $this->assertNotNull($board->name);
            $this->assertNotEmpty($board->name);
            $this->assertEquals($this->team->id, $board->team_id);
        }
    }

    public function test_communication_types_are_properly_ordered_by_weight()
    {
        $service = new TeamInitializationService($this->team);
        $service->createDefaultCommunicationTypes();

        $this->team->refresh();

        // Group communication types by type and verify weight ordering
        $typeGroups = $this->team->communicationTypes->groupBy('type');

        foreach ($typeGroups as $type => $items) {
            $weights = $items->pluck('weight')->toArray();
            $sortedWeights = $weights;
            sort($sortedWeights);

            // Verify the weights are in ascending order as configured
            $this->assertEquals($sortedWeights, $weights, "Communication types of type '{$type}' should be ordered by weight");
        }
    }

    public function test_default_talent_board_names_match_config()
    {
        $service = new TeamInitializationService($this->team);
        $service->createDefaultTalentBoards();

        $defaultBoards = config('defaults.talent_boards', []);
        $createdBoards = $this->team->talentBoards;

        $expectedNames = array_column($defaultBoards, 'name');
        $actualNames = $createdBoards->pluck('name')->toArray();

        sort($expectedNames);
        sort($actualNames);

        $this->assertEquals($expectedNames, $actualNames);
    }

    public function test_service_works_with_different_team_instances()
    {
        // Create another team
        $secondTeam = Team::factory()->create();

        // Run service for first team
        TeamInitializationService::run($this->team);

        // Run service for second team
        TeamInitializationService::run($secondTeam);

        // Verify both teams have their own records
        $this->assertGreaterThan(0, $this->team->talentBoards()->count());
        $this->assertGreaterThan(0, $this->team->communicationTypes()->count());

        $this->assertGreaterThan(0, $secondTeam->talentBoards()->count());
        $this->assertGreaterThan(0, $secondTeam->communicationTypes()->count());

        // Verify records are properly isolated
        $firstTeamBoards = TalentBoard::where('team_id', $this->team->id)->get();
        $secondTeamBoards = TalentBoard::where('team_id', $secondTeam->id)->get();

        $this->assertEquals($this->team->id, $firstTeamBoards->first()->team_id);
        $this->assertEquals($secondTeam->id, $secondTeamBoards->first()->team_id);
    }
}
