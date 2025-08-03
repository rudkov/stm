<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team1;
    protected Team $team2;
    protected User $user1;
    protected User $user2;
    protected Contact $team1Contact;

    /**
     * Setup common test state with two teams and a contact
     *
     * @param bool $createContact Whether to create a contact for team1
     * @return void
     */
    protected function setupTeamsAndUsers(bool $createContact = true): void
    {
        // Create two teams
        $this->team1 = Team::factory()->create();
        $this->team2 = Team::factory()->create();

        // Create users for each team
        $this->user1 = User::factory()->create(['team_id' => $this->team1->id]);
        $this->user2 = User::factory()->create(['team_id' => $this->team2->id]);

        // Create a contact belonging to team1 if requested
        if ($createContact) {
            $this->team1Contact = Contact::factory()->create([
                'team_id' => $this->team1->id,
                'first_name' => 'Team1',
                'last_name' => 'Contact',
                'created_by' => $this->user1->id,
                'updated_by' => $this->user1->id
            ]);
        }
    }

    public function test_only_users_from_same_team_can_view_contact()
    {
        $this->setupTeamsAndUsers();

        // User from same team should be able to view the contact
        $response = $this->actingAs($this->user1)
            ->getJson(route('contacts.show', $this->team1Contact->id));

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Team1',
                'last_name' => 'Contact'
            ]);

        // User from different team should not be able to view the contact
        $response = $this->actingAs($this->user2)
            ->getJson(route('contacts.show', $this->team1Contact->id));

        $response->assertStatus(403);
    }

    public function test_only_users_from_same_team_can_update_contact()
    {
        $this->setupTeamsAndUsers();

        // User from same team should be able to update the contact
        $response = $this->actingAs($this->user1)
            ->putJson(route('contacts.update', $this->team1Contact->id), [
                'first_name' => 'Updated',
                'last_name' => 'Name'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Updated',
                'last_name' => 'Name'
            ]);

        // User from different team should not be able to update the contact
        $response = $this->actingAs($this->user2)
            ->putJson(route('contacts.update', $this->team1Contact->id), [
                'first_name' => 'Should',
                'last_name' => 'Fail'
            ]);

        $response->assertStatus(403);
    }

    public function test_only_users_from_same_team_can_delete_contact()
    {
        $this->setupTeamsAndUsers();

        // User from different team should not be able to delete the contact
        $response = $this->actingAs($this->user2)
            ->deleteJson(route('contacts.destroy', $this->team1Contact->id));

        $response->assertStatus(403);

        // Verify contact still exists
        $this->assertDatabaseHas('contacts', [
            'id' => $this->team1Contact->id,
            'deleted_at' => null
        ]);

        // User from same team should be able to delete the contact
        $response = $this->actingAs($this->user1)
            ->deleteJson(route('contacts.destroy', $this->team1Contact->id));

        $response->assertStatus(204);

        // Verify contact is soft deleted
        $this->assertSoftDeleted('contacts', [
            'id' => $this->team1Contact->id
        ]);
    }

    public function test_only_user_with_team_can_create_contact()
    {
        $this->setupTeamsAndUsers(false); // Don't create contact

        // User with team should be able to create a contact
        $response = $this->actingAs($this->user1)
            ->postJson(route('contacts.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
            ]);

        $response->assertStatus(201);

        // Create a user without a team
        /** @var User $userWithoutTeam */
        $userWithoutTeam = User::factory()->create(['team_id' => null]);
        // User without team should not be able to create a contact
        $response = $this->actingAs($userWithoutTeam)
            ->postJson(route('contacts.store'), [
                'first_name' => 'Jane',
                'last_name' => 'Doe',
            ]);

        $response->assertStatus(403);
    }
}
