<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_team()
    {
        $user = User::factory()->create(['team_id' => null]);

        $response = $this->actingAs($user)
            ->postJson(route('team.store'), ['name' => 'New Team']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('teams', ['name' => 'New Team']);
        $user->refresh();
        $this->assertNotNull($user->team_id);
    }

    public function test_authenticated_user_with_team_cannot_create_another_team()
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);

        $response = $this->actingAs($user)
            ->postJson(route('team.store'), ['name' => 'Another Team']);

        $response->assertStatus(201);
        $this->assertDatabaseMissing('teams', ['name' => 'Another Team']);
        $user->refresh();
        $this->assertEquals($team->id, $user->team_id);
    }

    public function test_unauthenticated_user_cannot_create_team()
    {
        $response = $this->postJson(route('team.store'), ['name' => 'No Auth Team']);
        $response->assertStatus(401);
    }

    public function test_team_name_is_required()
    {
        $user = User::factory()->create(['team_id' => null]);
        $response = $this->actingAs($user)
            ->postJson(route('team.store'), ['name' => '']);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }
} 