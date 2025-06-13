<?php

namespace Tests\Feature;

use App\Models\TalentBoard;
use App\Models\Team;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TalentBoardPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team1;
    protected Team $team2;
    protected User|Authenticatable $user1;
    protected User|Authenticatable $user2;
    protected TalentBoard $team1TalentBoard;

    /**
     * Setup common test state with two teams and a talent board
     *
     * @param bool $createTalentBoard Whether to create a talent board for team1
     * @return void
     */
    protected function setupTeamsAndUsers(bool $createTalentBoard = true): void
    {
        // Create two teams
        $this->team1 = Team::factory()->create();
        $this->team2 = Team::factory()->create();

        // Create users for each team
        $this->user1 = User::factory()->create(['team_id' => $this->team1->id]);
        $this->user2 = User::factory()->create(['team_id' => $this->team2->id]);

        // Create a talent board belonging to team1 if requested
        if ($createTalentBoard) {
            $this->team1TalentBoard = TalentBoard::factory()->create([
                'team_id' => $this->team1->id,
                'name' => 'Team1 Board',
                'created_by' => $this->user1->id,
                'updated_by' => $this->user1->id
            ]);
        }
    }

    public function test_only_users_from_same_team_can_view_talent_board()
    {
        $this->setupTeamsAndUsers();

        // User from same team should be able to view the talent board
        $response = $this->actingAs($this->user1)
            ->getJson(route('talent-boards.show', $this->team1TalentBoard->id));

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Team1 Board'
            ]);

        // User from different team should not be able to view the talent board
        $response = $this->actingAs($this->user2)
            ->getJson(route('talent-boards.show', $this->team1TalentBoard->id));

        $response->assertStatus(403);
    }

    public function test_only_users_from_same_team_can_update_talent_board()
    {
        $this->setupTeamsAndUsers();

        // User from same team should be able to update the talent board
        $response = $this->actingAs($this->user1)
            ->putJson(route('talent-boards.update', $this->team1TalentBoard->id), [
                'name' => 'Updated Board Name'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Board Name'
            ]);

        // User from different team should not be able to update the talent board
        $response = $this->actingAs($this->user2)
            ->putJson(route('talent-boards.update', $this->team1TalentBoard->id), [
                'name' => 'Should Fail'
            ]);

        $response->assertStatus(403);
    }

    public function test_only_users_from_same_team_can_delete_talent_board()
    {
        $this->setupTeamsAndUsers();

        // User from different team should not be able to delete the talent board
        $response = $this->actingAs($this->user2)
            ->deleteJson(route('talent-boards.destroy', $this->team1TalentBoard->id));

        $response->assertStatus(403);

        // Verify talent board still exists
        $this->assertDatabaseHas('talent_boards', [
            'id' => $this->team1TalentBoard->id,
            'deleted_at' => null
        ]);

        // User from same team should be able to delete the talent board
        $response = $this->actingAs($this->user1)
            ->deleteJson(route('talent-boards.destroy', $this->team1TalentBoard->id));

        $response->assertStatus(204);

        // Verify talent board is soft deleted
        $this->assertSoftDeleted('talent_boards', [
            'id' => $this->team1TalentBoard->id
        ]);
    }

    public function test_only_user_with_team_can_create_talent_board()
    {
        $this->setupTeamsAndUsers(false); // Don't create talent board

        // User with team should be able to create a talent board
        $response = $this->actingAs($this->user1)
            ->postJson(route('talent-boards.store'), [
                'name' => 'New Talent Board'
            ]);

        $response->assertStatus(201);

        // Create a user without a team
        /** @var User|Authenticatable $userWithoutTeam */
        $userWithoutTeam = User::factory()->create(['team_id' => null]);

        // User without team should not be able to create a talent board
        $response = $this->actingAs($userWithoutTeam)
            ->postJson(route('talent-boards.store'), [
                'name' => 'Should Fail'
            ]);

        $response->assertStatus(403);
    }
}
