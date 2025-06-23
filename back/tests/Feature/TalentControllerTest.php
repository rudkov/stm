<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Models\Address;
use App\Models\CommunicationType;
use App\Models\Company;
use App\Models\Email;
use App\Models\Messenger;
use App\Models\MessengerType;
use App\Models\Phone;
use App\Models\Talent;
use App\Models\TalentBoard;
use App\Models\Team;
use App\Models\User;

use App\Services\TeamInitializationService;

use Database\Factories\TalentFactory;

class TalentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $team;

    protected function setUp(): void
    {
        parent::setUp();

        // Clear factory cache to ensure fresh data per test
        TalentFactory::clearCache();

        // Create a team and user
        $this->team = Team::factory()->create();
        $this->user = User::factory()->create(['team_id' => $this->team->id]);

        // Create default talent boards for the team (simulate normal team creation)
        $initializationService = new TeamInitializationService();
        $initializationService->createDefaultTalentBoards($this->team, $this->user->id);
    }

    public function test_store_talent_requires_first_name_or_last_name()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('talents.store'), [
                'first_name' => '',
                'last_name' => '',
                'citizenships' => [],
                'languages' => [],
                'relatives' => [],
                'addresses' => [],
                'emails' => [],
                'messengers' => [],
                'phones' => [],
                'social_medias' => [],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['first_name']);
    }

    public function test_store_talent_with_minimal_data()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('talents.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'citizenships' => [],
                'languages' => [],
                'relatives' => [],
                'addresses' => [],
                'emails' => [],
                'messengers' => [],
                'phones' => [],
                'social_medias' => [],
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'first_name' => 'John',
                'last_name' => 'Doe',
            ]);

        $this->assertDatabaseHas('talents', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);
    }

    public function test_store_talent_with_optional_fields()
    {
        // Create necessary types and references  
        $emailType = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $this->team->id]);
        $phoneType = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $this->team->id]);
        $addressType = CommunicationType::factory()->create(['type' => 'address', 'team_id' => $this->team->id]);
        $messengerType = MessengerType::factory()->create();
        $board = TalentBoard::factory()->create(['team_id' => $this->team->id]);
        $company = Company::factory()->create(['team_id' => $this->team->id]);

        // Generate realistic test data using factories
        $addressData = Address::factory()->make(['communication_type_id' => $addressType->id])->only(['info']);
        $emailData = Email::factory()->make(['communication_type_id' => $emailType->id])->only(['info']);
        $phoneData = Phone::factory()->make(['communication_type_id' => $phoneType->id])->only(['info']);
        $messengerData = Messenger::factory()->make(['messenger_type_id' => $messengerType->id])->only(['info']);

        $response = $this->actingAs($this->user)
            ->postJson(route('talents.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'legal_first_name' => 'Jonathan',
                'legal_last_name' => 'Doe',
                'birth_date' => '1990-01-01',
                'board_id' => $board->id,
                'mother_agency_id' => $company->id,
                'height_cm' => 180,
                'weight_kg' => 75,
                'comment' => 'Test comment',
                'citizenships' => [],
                'languages' => [],
                'relatives' => [],
                'addresses' => [
                    array_merge([
                        'type' => [
                            'id' => $addressType->id
                        ]
                    ], $addressData)
                ],
                'emails' => [
                    array_merge([
                        'type' => [
                            'id' => $emailType->id
                        ]
                    ], $emailData)
                ],
                'phones' => [
                    array_merge([
                        'type' => [
                            'id' => $phoneType->id
                        ]
                    ], $phoneData)
                ],
                'messengers' => [
                    array_merge([
                        'messenger_type_id' => $messengerType->id
                    ], $messengerData)
                ],
                'social_medias' => []
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'first_name' => 'John',
                'last_name' => 'Doe',
                'legal_first_name' => 'Jonathan',
                'legal_last_name' => 'Doe',
                'comment' => 'Test comment',
            ]);

        // Check talent was created
        $talent = Talent::where('first_name', 'John')->where('last_name', 'Doe')->first();
        $this->assertNotNull($talent);

        // Skip citizenship and language checks since we're not creating any

        // Skip relatives check since we're not creating any

        $this->assertDatabaseHas('addresses', array_merge([
            'addressable_id' => $talent->id,
            'addressable_type' => 'talent',
            'communication_type_id' => $addressType->id,
        ], $addressData));

        $this->assertDatabaseHas('emails', array_merge([
            'emailable_id' => $talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $emailType->id,
        ], $emailData));

        $this->assertDatabaseHas('phones', array_merge([
            'phoneable_id' => $talent->id,
            'phoneable_type' => 'talent',
            'communication_type_id' => $phoneType->id,
        ], $phoneData));

        $this->assertDatabaseHas('messengers', array_merge([
            'messengerable_id' => $talent->id,
            'messengerable_type' => 'talent',
            'messenger_type_id' => $messengerType->id,
        ], $messengerData));

        // Skip social medias check since we're not creating any
    }

    public function test_unauthorized_user_cannot_create_talent()
    {
        $response = $this->postJson(route('talents.store'), [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'citizenships' => [],
            'languages' => [],
            'relatives' => [],
            'addresses' => [],
            'emails' => [],
            'messengers' => [],
            'phones' => [],
            'social_medias' => [],
        ]);

        $response->assertStatus(401);
    }

    public function test_show_returns_talent_with_relationships()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('talents.show', $talent->id));

        $response->assertStatus(200)
            ->assertJson([
                'id' => $talent->id,
                'first_name' => 'John',
                'last_name' => 'Doe',
            ]);
    }

    public function test_update_talent_basic_info()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'comment' => 'Old comment',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('talents.update', $talent->id), [
                'first_name' => 'Updated',
                'last_name' => 'Name',
                'comment' => 'New comment',
                'citizenships' => [],
                'languages' => [],
                'relatives' => [],
                'addresses' => [],
                'emails' => [],
                'messengers' => [],
                'phones' => [],
                'social_medias' => [],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Updated',
                'last_name' => 'Name',
                'comment' => 'New comment',
            ]);

        $this->assertDatabaseHas('talents', [
            'id' => $talent->id,
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'comment' => 'New comment',
            'updated_by' => $this->user->id,
        ]);
    }

    public function test_update_talent_with_empty_relationships()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('talents.update', $talent->id), [
                'first_name' => $talent->first_name,
                'last_name' => $talent->last_name,
                'citizenships' => [],
                'languages' => [],
                'relatives' => [],
                'addresses' => [],
                'emails' => [],
                'messengers' => [],
                'phones' => [],
                'social_medias' => [],
            ]);

        $response->assertStatus(200);
    }

    public function test_unauthorized_user_cannot_update_talent()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Create another user in a different team
        $otherTeam = Team::factory()->create();
        /** @var \App\Models\User $otherUser */
        $otherUser = User::factory()->create(['team_id' => $otherTeam->id]);

        $response = $this->actingAs($otherUser)
            ->putJson(route('talents.update', $talent->id), [
                'first_name' => 'Unauthorized',
                'last_name' => 'Update',
                'citizenships' => [],
                'languages' => [],
                'relatives' => [],
                'addresses' => [],
                'emails' => [],
                'messengers' => [],
                'phones' => [],
                'social_medias' => [],
            ]);

        $response->assertStatus(403); // Forbidden
    }

    public function test_destroy_talent()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson(route('talents.destroy', $talent->id));

        $response->assertStatus(204);

        $this->assertSoftDeleted('talents', [
            'id' => $talent->id,
        ]);
    }

    public function test_unauthorized_user_cannot_delete_talent()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->deleteJson(route('talents.destroy', $talent->id));

        $response->assertStatus(401);
    }

    public function test_index_returns_talent_collection()
    {
        // Create test talents
        Talent::factory()->count(3)->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Create a talent for another team (shouldn't be visible)
        $otherTeam = Team::factory()->create();
        Talent::factory()->create([
            'team_id' => $otherTeam->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('talents.index'));

        $response->assertStatus(200);

        // Should only return talents from user's team - check if it's wrapped in data or not
        $json = $response->json();
        if (isset($json['data'])) {
            $this->assertCount(3, $json['data']);
        } else {
            $this->assertCount(3, $json);
        }
    }

    public function test_search_with_filters()
    {
        // Create talents with different attributes
        $talent1 = Talent::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'team_id' => $this->team->id,
            'location' => 'New York',
            'height_cm' => 180,
        ]);

        $talent2 = Talent::factory()->create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'team_id' => $this->team->id,
            'location' => 'Los Angeles',
            'height_cm' => 170,
        ]);

        // Test search without filters (should return all)
        $response = $this->actingAs($this->user)
            ->postJson(route('talents.search'), []);

        $response->assertStatus(200);
        $json = $response->json();

        // Check if response has data wrapper or direct array
        $talents = isset($json['data']) ? $json['data'] : $json;
        $this->assertCount(2, $talents);

        // Test search with specific filters (this would depend on TalentSearchRequest validation rules)
        $response = $this->actingAs($this->user)
            ->postJson(route('talents.search'), [
                'first_name' => 'John'
            ]);

        $response->assertStatus(200);
    }

    public function test_search_requires_authentication()
    {
        $response = $this->postJson(route('talents.search'), []);

        $response->assertStatus(401);
    }

    public function test_locations_returns_unique_locations()
    {
        // Create talents with different locations
        Talent::factory()->create([
            'team_id' => $this->team->id,
            'location' => 'New York',
        ]);

        Talent::factory()->create([
            'team_id' => $this->team->id,
            'location' => 'Los Angeles',
        ]);

        Talent::factory()->create([
            'team_id' => $this->team->id,
            'location' => 'New York', // Duplicate
        ]);

        Talent::factory()->create([
            'team_id' => $this->team->id,
            'location' => null, // Null location
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('talents.locations'));

        $response->assertStatus(200);

        $locations = $response->json();

        // Should have unique locations (including null)
        $this->assertCount(3, $locations);
        $this->assertContains('New York', $locations);
        $this->assertContains('Los Angeles', $locations);
        $this->assertContains(null, $locations);
    }

    public function test_locations_only_returns_team_talents()
    {
        // Create talent for current team
        Talent::factory()->create([
            'team_id' => $this->team->id,
            'location' => 'Team Location',
        ]);

        // Create talent for different team
        $otherTeam = Team::factory()->create();
        Talent::factory()->create([
            'team_id' => $otherTeam->id,
            'location' => 'Other Team Location',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('talents.locations'));

        $response->assertStatus(200);

        $locations = $response->json();

        $this->assertContains('Team Location', $locations);
        $this->assertNotContains('Other Team Location', $locations);
    }

    public function test_locations_requires_authentication()
    {
        $response = $this->getJson(route('talents.locations'));

        $response->assertStatus(401);
    }

    public function test_managers_returns_unique_managers()
    {
        // Create additional users to be managers
        $manager1 = User::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Manager One'
        ]);

        $manager2 = User::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Manager Two'
        ]);

        // Create talents with different managers
        Talent::factory()->create([
            'team_id' => $this->team->id,
            'manager_id' => $manager1->id,
        ]);

        Talent::factory()->create([
            'team_id' => $this->team->id,
            'manager_id' => $manager2->id,
        ]);

        Talent::factory()->create([
            'team_id' => $this->team->id,
            'manager_id' => $manager1->id, // Duplicate manager
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('talents.managers'));

        $response->assertStatus(200);

        $managers = $response->json();

        // Should have unique managers
        $this->assertCount(2, $managers);

        // Check structure (should have id and name)
        $this->assertArrayHasKey('id', $managers[0]);
        $this->assertArrayHasKey('name', $managers[0]);

        // Check managers are included
        $managerNames = collect($managers)->pluck('name')->toArray();
        $this->assertContains('Manager One', $managerNames);
        $this->assertContains('Manager Two', $managerNames);
    }

    public function test_managers_only_returns_team_managers()
    {
        // Create manager for current team
        $teamManager = User::factory()->create([
            'team_id' => $this->team->id,
            'name' => 'Team Manager'
        ]);

        Talent::factory()->create([
            'team_id' => $this->team->id,
            'manager_id' => $teamManager->id,
        ]);

        // Create manager for different team
        $otherTeam = Team::factory()->create();
        $otherManager = User::factory()->create([
            'team_id' => $otherTeam->id,
            'name' => 'Other Manager'
        ]);

        Talent::factory()->create([
            'team_id' => $otherTeam->id,
            'manager_id' => $otherManager->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('talents.managers'));

        $response->assertStatus(200);

        $managers = $response->json();
        $managerNames = collect($managers)->pluck('name')->toArray();

        $this->assertContains('Team Manager', $managerNames);
        $this->assertNotContains('Other Manager', $managerNames);
    }

    public function test_managers_requires_authentication()
    {
        $response = $this->getJson(route('talents.managers'));

        $response->assertStatus(401);
    }

    public function test_update_location()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
            'location' => 'Old Location',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('talents.update-location', $talent), [
                'location' => 'New Location',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'location' => 'New Location'
            ]);

        // Verify location was updated in database
        $talent->refresh();
        $this->assertEquals('New Location', $talent->location);
    }

    public function test_update_location_can_set_null()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
            'location' => 'Some Location',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('talents.update-location', $talent), [
                'location' => null,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'location' => null
            ]);

        $talent->refresh();
        $this->assertNull($talent->location);
    }

    public function test_update_location_requires_authorization()
    {
        // Create talent for different team
        $otherTeam = Team::factory()->create();
        $talent = Talent::factory()->create([
            'team_id' => $otherTeam->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('talents.update-location', $talent), [
                'location' => 'New Location',
            ]);

        $response->assertStatus(403);
    }

    public function test_update_location_requires_authentication()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
        ]);

        $response = $this->putJson(route('talents.update-location', $talent), [
            'location' => 'New Location'
        ]);

        $response->assertStatus(401);
    }

    public function test_update_location_does_not_update_timestamps_and_tracking()
    {
        $talent = Talent::factory()->create([
            'team_id' => $this->team->id,
            'location' => 'Old Location',
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Store original values
        $originalUpdatedAt = $talent->updated_at;
        $originalUpdatedBy = $talent->updated_by;

        // Wait a moment to ensure timestamp would change if it were being updated
        sleep(1);

        $response = $this->actingAs($this->user)
            ->putJson(route('talents.update-location', $talent), [
                'location' => 'New Location',
            ]);

        $response->assertStatus(200);

        // Refresh talent from database
        $talent->refresh();

        // Verify location was updated
        $this->assertEquals('New Location', $talent->location);

        // Verify timestamps and tracking were NOT updated
        $this->assertEquals($originalUpdatedAt->format('Y-m-d H:i:s'), $talent->updated_at->format('Y-m-d H:i:s'));
        $this->assertEquals($originalUpdatedBy, $talent->updated_by);
    }
}
