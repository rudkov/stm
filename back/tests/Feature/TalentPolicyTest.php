<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

use App\Models\Talent;
use App\Models\Team;
use App\Models\User;

use Database\Factories\TalentFactory;
use Database\Seeders\FirstTimeSeeder;

class TalentPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team1;
    protected Team $team2;
    protected User $user1;
    protected User $user2;
    protected Talent $team1Talent;

    /**
     * Setup common test state with two teams and a talent
     *
     * @param bool $createTalent Whether to create a talent for team1
     * @return void
     */
    protected function setupTeamsAndUsers(bool $createTalent = true): void
    {
        // Clear factory cache to ensure fresh data per test
        TalentFactory::clearCache();

        // Seed lookup data
        $this->seed(FirstTimeSeeder::class);

        // Create two teams
        $this->team1 = Team::factory()->create();
        $this->team2 = Team::factory()->create();

        // Create users for each team
        $this->user1 = User::factory()->create(['team_id' => $this->team1->id]);
        $this->user2 = User::factory()->create(['team_id' => $this->team2->id]);

        // Create a talent belonging to team1 if requested
        if ($createTalent) {
            $this->team1Talent = Talent::factory()->create([
                'team_id' => $this->team1->id,
                'first_name' => 'Team1',
                'last_name' => 'Talent',
                'created_by' => $this->user1->id,
                'updated_by' => $this->user1->id
            ]);
        }
    }

    public function test_only_users_from_same_team_can_view_talent()
    {
        $this->setupTeamsAndUsers();

        // User from same team should be able to view the talent
        $response = $this->actingAs($this->user1)
            ->getJson(route('talents.show', $this->team1Talent->id));

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Team1',
                'last_name' => 'Talent'
            ]);

        // User from different team should not be able to view the talent
        $response = $this->actingAs($this->user2)
            ->getJson(route('talents.show', $this->team1Talent->id));

        $response->assertStatus(403);
    }

    public function test_only_users_from_same_team_can_update_talent()
    {
        $this->setupTeamsAndUsers();

        // User from same team should be able to update the talent
        $response = $this->actingAs($this->user1)
            ->putJson(route('talents.update', $this->team1Talent->id), [
                'first_name' => 'Updated',
                'last_name' => 'Name',
                'citizenships' => [],
                'languages' => [],
                'emergency_contacts' => [],
                'addresses' => [],
                'emails' => [],
                'messengers' => [],
                'phones' => [],
                'social_medias' => [],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Updated',
                'last_name' => 'Name'
            ]);

        // User from different team should not be able to update the talent
        $response = $this->actingAs($this->user2)
            ->putJson(route('talents.update', $this->team1Talent->id), [
                'first_name' => 'Should',
                'last_name' => 'Fail',
                'citizenships' => [],
                'languages' => [],
                'emergency_contacts' => [],
                'addresses' => [],
                'emails' => [],
                'messengers' => [],
                'phones' => [],
                'social_medias' => [],
            ]);

        $response->assertStatus(403);
    }

    public function test_only_users_from_same_team_can_delete_talent()
    {
        $this->setupTeamsAndUsers();

        // User from different team should not be able to delete the talent
        $response = $this->actingAs($this->user2)
            ->deleteJson(route('talents.destroy', $this->team1Talent->id));

        $response->assertStatus(403);

        // Verify talent still exists
        $this->assertDatabaseHas('talents', [
            'id' => $this->team1Talent->id,
            'deleted_at' => null
        ]);

        // User from same team should be able to delete the talent
        $response = $this->actingAs($this->user1)
            ->deleteJson(route('talents.destroy', $this->team1Talent->id));

        $response->assertStatus(204);

        // Verify talent is soft deleted
        $this->assertSoftDeleted('talents', [
            'id' => $this->team1Talent->id
        ]);
    }

    public function test_only_user_with_team_can_create_talent()
    {
        $this->setupTeamsAndUsers(false); // Don't create talent

        // User with team should be able to create a talent
        $response = $this->actingAs($this->user1)
            ->postJson(route('talents.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'citizenships' => [],
                'languages' => [],
                'emergency_contacts' => [],
                'addresses' => [],
                'emails' => [],
                'messengers' => [],
                'phones' => [],
                'social_medias' => [],
            ]);

        $response->assertStatus(201);

        // Create a user without a team
        /** @var User|Authenticatable $userWithoutTeam */
        $userWithoutTeam = User::factory()->create(['team_id' => null]);

        // User without team should not be able to create a talent
        $response = $this->actingAs($userWithoutTeam)
            ->postJson(route('talents.store'), [
                'first_name' => 'Jane',
                'last_name' => 'Doe',
                'citizenships' => [],
                'languages' => [],
                'emergency_contacts' => [],
                'addresses' => [],
                'emails' => [],
                'messengers' => [],
                'phones' => [],
                'social_medias' => [],
            ]);

        $response->assertStatus(403);
    }
}
