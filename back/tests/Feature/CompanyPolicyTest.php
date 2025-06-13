<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Team;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team1;
    protected Team $team2;
    protected User|Authenticatable $user1;
    protected User|Authenticatable $user2;
    protected Company $team1Company;

    /**
     * Setup common test state with two teams and a company
     *
     * @param bool $createCompany Whether to create a company for team1
     * @return void
     */
    protected function setupTeamsAndUsers(bool $createCompany = true): void
    {
        // Create two teams
        $this->team1 = Team::factory()->create();
        $this->team2 = Team::factory()->create();

        // Create users for each team
        $this->user1 = User::factory()->create(['team_id' => $this->team1->id]);
        $this->user2 = User::factory()->create(['team_id' => $this->team2->id]);

        // Create a company belonging to team1 if requested
        if ($createCompany) {
            $this->team1Company = Company::factory()->create([
                'team_id' => $this->team1->id,
                'name' => 'Team1 Company',
                'created_by' => $this->user1->id,
                'updated_by' => $this->user1->id
            ]);
        }
    }

    public function test_only_users_from_same_team_can_view_company()
    {
        $this->setupTeamsAndUsers();

        // User from same team should be able to view the company
        $response = $this->actingAs($this->user1)
            ->getJson(route('companies.show', $this->team1Company->id));
        
        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Team1 Company',
            ]);

        // User from different team should not be able to view the company
        $response = $this->actingAs($this->user2)
            ->getJson(route('companies.show', $this->team1Company->id));
        
        $response->assertStatus(403);
    }

    public function test_only_users_from_same_team_can_update_company()
    {
        $this->setupTeamsAndUsers();

        // User from same team should be able to update the company
        $response = $this->actingAs($this->user1)
            ->putJson(route('companies.update', $this->team1Company->id), [
                'name' => 'Updated Company'
            ]);
        
        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Company'
            ]);

        // User from different team should not be able to update the company
        $response = $this->actingAs($this->user2)
            ->putJson(route('companies.update', $this->team1Company->id), [
                'name' => 'Should Fail'
            ]);
        
        $response->assertStatus(403);
    }

    public function test_only_users_from_same_team_can_delete_company()
    {
        $this->setupTeamsAndUsers();

        // User from different team should not be able to delete the company
        $response = $this->actingAs($this->user2)
            ->deleteJson(route('companies.destroy', $this->team1Company->id));
        
        $response->assertStatus(403);

        // Verify company still exists
        $this->assertDatabaseHas('companies', [
            'id' => $this->team1Company->id,
            'deleted_at' => null
        ]);

        // User from same team should be able to delete the company
        $response = $this->actingAs($this->user1)
            ->deleteJson(route('companies.destroy', $this->team1Company->id));
        
        $response->assertStatus(204);

        // Verify company is soft deleted
        $this->assertSoftDeleted('companies', [
            'id' => $this->team1Company->id
        ]);
    }

    public function test_only_user_with_team_can_create_company()
    {
        $this->setupTeamsAndUsers(false); // Don't create company

        // User with team should be able to create a company
        $response = $this->actingAs($this->user1)
            ->postJson(route('companies.store'), [
                'name' => 'New Company',
            ]);

        $response->assertStatus(201);

        // Create a user without a team
        /** @var User|Authenticatable $userWithoutTeam */
        $userWithoutTeam = User::factory()->create(['team_id' => null]);
        
        // User without team should not be able to create a company
        $response = $this->actingAs($userWithoutTeam)
            ->postJson(route('companies.store'), [
                'name' => 'Should Fail',
            ]);

        $response->assertStatus(403);
    }
} 