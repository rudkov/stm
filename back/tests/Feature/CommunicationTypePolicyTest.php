<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunicationTypePolicyTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team;
    protected User|Authenticatable $userWithTeam;
    protected User|Authenticatable $userWithoutTeam;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a team and user with team
        $this->team = Team::factory()->create();
        $this->userWithTeam = User::factory()->create(['team_id' => $this->team->id]);

        // Create a user without team
        $this->userWithoutTeam = User::factory()->create(['team_id' => null]);
    }

    public function test_user_with_team_can_view_any_communication_types()
    {
        $response = $this->actingAs($this->userWithTeam)
            ->getJson(route('communication-types.index'));

        $response->assertStatus(200);
    }

    public function test_user_without_team_cannot_view_any_communication_types()
    {
        $response = $this->actingAs($this->userWithoutTeam)
            ->getJson(route('communication-types.index'));

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_view_communication_types()
    {
        $response = $this->getJson(route('communication-types.index'));

        $response->assertStatus(401);
    }

    public function test_user_with_team_can_update_communication_types()
    {
        $response = $this->actingAs($this->userWithTeam)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    ['name' => 'Work Email'],
                    ['name' => 'Personal Email']
                ]
            ]);

        $response->assertStatus(200);
    }

    public function test_user_without_team_cannot_update_communication_types()
    {
        $response = $this->actingAs($this->userWithoutTeam)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    ['name' => 'Work Email'],
                    ['name' => 'Personal Email']
                ]
            ]);

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_update_communication_types()
    {
        $response = $this->putJson(route('communication-types.update'), [
            'email' => [
                ['name' => 'Work Email'],
                ['name' => 'Personal Email']
            ]
        ]);

        $response->assertStatus(401);
    }
}
