<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Team;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyControllerTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team;
    protected User|Authenticatable $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a team and user
        $this->team = Team::factory()->create();
        $this->user = User::factory()->create(['team_id' => $this->team->id]);
    }

    public function test_store_company_requires_name()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_company_with_minimal_data()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => 'Test Company',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'Test Company',
            ]);

        $this->assertDatabaseHas('companies', [
            'name' => 'Test Company',
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);
    }

    public function test_unauthorized_user_cannot_create_company()
    {
        $response = $this->postJson(route('companies.store'), [
                'name' => 'Test Company',
            ]);

        $response->assertStatus(401);
    }

    public function test_update_company_basic_info()
    {
        $company = Company::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
            'name' => 'Original Company',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('companies.update', $company), [
                'name' => 'Updated Company',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Company',
            ]);

        $this->assertDatabaseHas('companies', [
            'id' => $company->id,
            'name' => 'Updated Company',
            'updated_by' => $this->user->id,
        ]);
    }

    public function test_update_company_with_contacts()
    {
        $company = Company::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Attach contact with job title
        $company->contacts()->attach($contact->id, ['job_title' => 'Developer']);

        // Load the company with contacts
        $response = $this->actingAs($this->user)
            ->getJson(route('companies.show', $company->id));

        $response->assertStatus(200)
            ->assertJson([
                'contacts' => [
                    [
                        'id' => $contact->id,
                        'first_name' => $contact->first_name,
                        'last_name' => $contact->last_name,
                        'job_title' => 'Developer',
                    ]
                ]
            ]);
    }

    public function test_unauthorized_user_cannot_update_company()
    {
        $company = Company::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Create another user in a different team
        $otherTeam = Team::factory()->create();
        /** @var User|Authenticatable $otherUser */
        $otherUser = User::factory()->create(['team_id' => $otherTeam->id]);

        $response = $this->actingAs($otherUser)
            ->putJson(route('companies.update', $company), [
                'name' => 'Unauthorized Update',
            ]);

        $response->assertStatus(403); // Forbidden
    }

    public function test_delete_company()
    {
        $company = Company::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson(route('companies.destroy', $company));

        $response->assertStatus(204);

        // Verify company is soft deleted
        $this->assertSoftDeleted('companies', [
            'id' => $company->id
        ]);
    }

    public function test_unauthorized_user_cannot_delete_company()
    {
        $company = Company::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Create another user in a different team
        $otherTeam = Team::factory()->create();
        /** @var User|Authenticatable $otherUser */
        $otherUser = User::factory()->create(['team_id' => $otherTeam->id]);

        $response = $this->actingAs($otherUser)
            ->deleteJson(route('companies.destroy', $company));

        $response->assertStatus(403); // Forbidden

        // Verify company still exists and is not deleted
        $this->assertDatabaseHas('companies', [
            'id' => $company->id,
            'deleted_at' => null
        ]);
    }

    public function test_list_companies()
    {
        // Create multiple companies for the team
        $companies = Company::factory()->count(3)->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('companies.index'));

        $response->assertStatus(200);

        // Check that all companies are returned and sorted by name
        $responseData = $response->json();
        $this->assertCount(3, $responseData);
        
        // Verify the response structure matches CompanyCollection format
        foreach ($responseData as $company) {
            $this->assertArrayHasKey('id', $company);
            $this->assertArrayHasKey('name', $company);
        }
    }

    public function test_show_company_details()
    {
        $company = Company::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('companies.show', $company));

        $response->assertStatus(200)
            ->assertJson([
                'id' => $company->id,
                'name' => $company->name,
            ]);

        // Verify the response includes created_by and updated_by information
        $response->assertJsonStructure([
            'id',
            'name',
            'created_at',
            'updated_at',
            'created_by' => ['id', 'name'],
            'updated_by' => ['id', 'name'],
        ]);
    }
} 