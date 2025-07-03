<?php

namespace Tests\Feature;

use App\Models\CommunicationType;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommunicationTypeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->team = Team::factory()->create();
        $this->user = User::factory()->create(['team_id' => $this->team->id]);
    }

    public function test_index_returns_communication_types_grouped_by_type()
    {
        // Create some communication types for the team
        CommunicationType::factory()->create([
            'name' => 'Work Email',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        CommunicationType::factory()->create([
            'name' => 'Personal Email',
            'type' => 'email',
            'weight' => 1,
            'team_id' => $this->team->id
        ]);

        CommunicationType::factory()->create([
            'name' => 'Home Address',
            'type' => 'address',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('communication-types.index'));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'address' => [
                    '*' => ['id', 'name']
                ],
                'email' => [
                    '*' => ['id', 'name']
                ],
                'phone' => []
            ])
            ->assertJsonPath('email.0.name', 'Work Email')
            ->assertJsonPath('email.1.name', 'Personal Email')
            ->assertJsonPath('address.0.name', 'Home Address');
    }

    public function test_index_only_returns_communication_types_for_user_team()
    {
        $otherTeam = Team::factory()->create();

        // Create communication type for user's team
        CommunicationType::factory()->create([
            'name' => 'User Team Email',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        // Create communication type for other team
        CommunicationType::factory()->create([
            'name' => 'Other Team Email',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $otherTeam->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('communication-types.index'));

        $response->assertStatus(200)
            ->assertJsonPath('email.0.name', 'User Team Email')
            ->assertJsonMissing(['name' => 'Other Team Email']);
    }

    public function test_index_orders_by_type_then_weight()
    {
        // Create types with different weights and types
        CommunicationType::factory()->create([
            'name' => 'Second Email',
            'type' => 'email',
            'weight' => 1,
            'team_id' => $this->team->id
        ]);

        CommunicationType::factory()->create([
            'name' => 'First Email',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        CommunicationType::factory()->create([
            'name' => 'First Address',
            'type' => 'address',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('communication-types.index'));

        $response->assertStatus(200)
            ->assertJsonPath('address.0.name', 'First Address')
            ->assertJsonPath('email.0.name', 'First Email')
            ->assertJsonPath('email.1.name', 'Second Email');
    }

    public function test_update_can_create_new_communication_types()
    {
        $response = $this->actingAs($this->user)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    ['name' => 'Work Email'],
                    ['name' => 'Personal Email']
                ],
                'address' => [
                    ['name' => 'Home Address']
                ]
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('communication_types', [
            'name' => 'Work Email',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        $this->assertDatabaseHas('communication_types', [
            'name' => 'Personal Email',
            'type' => 'email',
            'weight' => 1,
            'team_id' => $this->team->id
        ]);

        $this->assertDatabaseHas('communication_types', [
            'name' => 'Home Address',
            'type' => 'address',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);
    }

    public function test_update_can_update_existing_communication_types()
    {
        $existingType = CommunicationType::factory()->create([
            'name' => 'Old Name',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    [
                        'id' => $existingType->id,
                        'name' => 'Updated Name'
                    ]
                ]
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('communication_types', [
            'id' => $existingType->id,
            'name' => 'Updated Name',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);
    }

    public function test_update_can_delete_communication_types_not_in_request()
    {
        $keepType = CommunicationType::factory()->create([
            'name' => 'Keep This',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        $deleteType = CommunicationType::factory()->create([
            'name' => 'Delete This',
            'type' => 'email',
            'weight' => 1,
            'team_id' => $this->team->id
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    [
                        'id' => $keepType->id,
                        'name' => 'Keep This'
                    ]
                ]
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('communication_types', [
            'id' => $keepType->id
        ]);

        $this->assertDatabaseMissing('communication_types', [
            'id' => $deleteType->id
        ]);
    }

    public function test_update_sets_weights_based_on_array_index()
    {
        $response = $this->actingAs($this->user)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    ['name' => 'Third Email'],
                    ['name' => 'First Email'],
                    ['name' => 'Second Email']
                ]
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('communication_types', [
            'name' => 'Third Email',
            'weight' => 0
        ]);

        $this->assertDatabaseHas('communication_types', [
            'name' => 'First Email',
            'weight' => 1
        ]);

        $this->assertDatabaseHas('communication_types', [
            'name' => 'Second Email',
            'weight' => 2
        ]);
    }

    public function test_update_can_handle_mixed_operations()
    {
        $updateType = CommunicationType::factory()->create([
            'name' => 'Old Name',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        $deleteType = CommunicationType::factory()->create([
            'name' => 'To Delete',
            'type' => 'email',
            'weight' => 1,
            'team_id' => $this->team->id
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    [
                        'id' => $updateType->id,
                        'name' => 'Updated Name'
                    ],
                    ['name' => 'New Email Type']
                ]
            ]);

        $response->assertStatus(200);

        // Updated existing
        $this->assertDatabaseHas('communication_types', [
            'id' => $updateType->id,
            'name' => 'Updated Name',
            'weight' => 0
        ]);

        // Created new
        $this->assertDatabaseHas('communication_types', [
            'name' => 'New Email Type',
            'weight' => 1,
            'type' => 'email',
            'team_id' => $this->team->id
        ]);

        // Deleted missing
        $this->assertDatabaseMissing('communication_types', [
            'id' => $deleteType->id
        ]);
    }

    public function test_update_can_handle_empty_type_data()
    {
        $existingType = CommunicationType::factory()->create([
            'name' => 'Existing Email',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $this->team->id
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('communication-types.update'), [
                'email' => []
            ]);

        $response->assertStatus(200);

        // Should delete all existing types of this type when passing empty array
        $this->assertDatabaseMissing('communication_types', [
            'id' => $existingType->id
        ]);
    }

    public function test_update_only_affects_user_team_communication_types()
    {
        $otherTeam = Team::factory()->create();

        $otherTeamType = CommunicationType::factory()->create([
            'name' => 'Other Team Email',
            'type' => 'email',
            'weight' => 0,
            'team_id' => $otherTeam->id
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    ['name' => 'User Team Email']
                ]
            ]);

        $response->assertStatus(200);

        // Other team's types should remain untouched
        $this->assertDatabaseHas('communication_types', [
            'id' => $otherTeamType->id,
            'name' => 'Other Team Email'
        ]);

        // User's team should have new type
        $this->assertDatabaseHas('communication_types', [
            'name' => 'User Team Email',
            'team_id' => $this->team->id
        ]);
    }

    public function test_update_validates_request_data()
    {
        // Test with invalid name format (missing required field)
        $response = $this->actingAs($this->user)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    ['invalid_field' => 'Missing name field']
                ]
            ]);

        $response->assertStatus(422);

        // Test with duplicate names in the same request
        $response = $this->actingAs($this->user)
            ->putJson(route('communication-types.update'), [
                'email' => [
                    ['name' => 'Duplicate Name'],
                    ['name' => 'Duplicate Name']
                ]
            ]);

        $response->assertStatus(422);
    }

    public function test_unauthorized_user_cannot_access_communication_types()
    {
        $response = $this->getJson(route('communication-types.index'));
        $response->assertStatus(401);

        $response = $this->putJson(route('communication-types.update'), []);
        $response->assertStatus(401);
    }

    public function test_user_without_team_cannot_access_communication_types()
    {
        /** @var User $userWithoutTeam */
        $userWithoutTeam = User::factory()->create(['team_id' => null]);

        $response = $this->actingAs($userWithoutTeam)
            ->getJson(route('communication-types.index'));
        $response->assertStatus(403);

        $response = $this->actingAs($userWithoutTeam)
            ->putJson(route('communication-types.update'), []);
        $response->assertStatus(403);
    }
}
