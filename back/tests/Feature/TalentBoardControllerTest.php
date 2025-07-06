<?php

namespace Tests\Feature;

use App\Models\TalentBoard;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Config;
use App\Services\TeamInitializationService;

class TalentBoardControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $team;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a team and user
        $this->team = Team::factory()->create();
        $this->user = User::factory()->create(['team_id' => $this->team->id]);

        // Create default talent boards for the team (simulate normal team creation)
        $initializationService = new TeamInitializationService($this->team);
        $initializationService->createDefaultTalentBoards();
    }

    public function test_store_talent_board_requires_name()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('talent-boards.store'), [
                'name' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_talent_board_with_valid_data()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('talent-boards.store'), [
                'name' => 'New Board',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'New Board',
            ]);

        $this->assertDatabaseHas('talent_boards', [
            'name' => 'New Board',
            'team_id' => $this->team->id,
        ]);
    }

    public function test_store_validates_unique_name_within_team()
    {
        // Create an existing board
        TalentBoard::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Test Board',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson(route('talent-boards.store'), [
                'name' => 'Test Board', // Already exists for this team
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_unauthorized_user_cannot_create_talent_board()
    {
        $response = $this->postJson(route('talent-boards.store'), [
            'name' => 'New Board',
        ]);

        $response->assertStatus(401);
    }

    public function test_index_lists_talent_boards_for_team()
    {
        // Create test boards
        TalentBoard::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Board A',
        ]);

        TalentBoard::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Board B',
        ]);

        // Create a board for another team (shouldn't be visible)
        $otherTeam = Team::factory()->create();
        TalentBoard::factory()->create([
            'team_id' => $otherTeam->id,
            'name' => 'Other Team Board',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('talent-boards.index'));

        // Get default boards from config
        $defaultBoards = Config::get('defaults.talent_boards', []);
        $expectedBoardCount = count($defaultBoards) + 2; // Default boards + 2 created boards

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                ]
            ])
            ->assertJsonCount($expectedBoardCount);

        $data = $response->json();

        // Get all board names from the response
        $boardNames = collect($data)->pluck('name')->toArray();

        // Assert that all expected boards are present
        $this->assertContains('Board A', $boardNames);
        $this->assertContains('Board B', $boardNames);

        // Assert that all default boards are present
        foreach ($defaultBoards as $defaultBoard) {
            $this->assertContains($defaultBoard['name'], $boardNames);
        }

        // Assert that the other team's board is not present
        $this->assertNotContains('Other Team Board', $boardNames);
    }

    public function test_update_talent_board()
    {
        $board = TalentBoard::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Original Name',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('talent-boards.update', $board->id), [
                'name' => 'Updated Name',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $board->id,
                'name' => 'Updated Name',
            ]);

        $this->assertDatabaseHas('talent_boards', [
            'id' => $board->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_update_validates_unique_name_within_team()
    {
        // Create two boards
        $board1 = TalentBoard::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Board One',
        ]);

        $board2 = TalentBoard::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Board Two',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('talent-boards.update', $board2->id), [
                'name' => 'Board One', // Already exists for this team
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_unauthorized_user_cannot_update_talent_board()
    {
        $board = TalentBoard::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Test Board',
        ]);

        $response = $this->putJson(route('talent-boards.update', $board->id), [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(401);
    }

    public function test_destroy_talent_board()
    {
        $board = TalentBoard::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Test Board',
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson(route('talent-boards.destroy', $board->id));

        $response->assertStatus(204);

        $this->assertDatabaseMissing('talent_boards', [
            'id' => $board->id,
        ]);
    }

    public function test_unauthorized_user_cannot_delete_talent_board()
    {
        $board = TalentBoard::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Test Board',
        ]);

        $response = $this->deleteJson(route('talent-boards.destroy', $board->id));

        $response->assertStatus(401);
    }
}
