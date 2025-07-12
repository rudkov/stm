<?php

namespace Tests\Feature;

use Tests\TestCase;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Models\Address;
use App\Models\CommunicationType;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Email;
use App\Models\Messenger;
use App\Models\MessengerType;
use App\Models\Phone;
use App\Models\SocialMedia;
use App\Models\SocialMediaType;
use App\Models\Team;
use App\Models\User;
use App\Models\Weblink;

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

    public function test_store_company_with_addresses()
    {
        $communicationType = CommunicationType::factory()->create([
            'team_id' => $this->team->id,
            'type' => 'address'
        ]);

        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => 'Test Company',
                'addresses' => [
                    [
                        'type' => ['id' => $communicationType->id],
                        'info' => '123 Main St, City, State 12345'
                    ],
                    [
                        'type' => ['id' => $communicationType->id],
                        'info' => '456 Work Ave, Business District'
                    ]
                ]
            ]);

        $response->assertStatus(201);

        $company = Company::where('name', 'Test Company')->first();
        $this->assertNotNull($company);

        // Verify addresses were created
        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $company->id,
            'addressable_type' => 'company',
            'communication_type_id' => $communicationType->id,
            'info' => '123 Main St, City, State 12345'
        ]);

        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $company->id,
            'addressable_type' => 'company',
            'communication_type_id' => $communicationType->id,
            'info' => '456 Work Ave, Business District'
        ]);

        $this->assertEquals(2, $company->addresses()->count());
    }

    public function test_store_company_with_emails()
    {
        $emailType = CommunicationType::factory()->create([
            'team_id' => $this->team->id,
            'type' => 'email'
        ]);

        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => 'Test Company',
                'emails' => [
                    [
                        'type' => ['id' => $emailType->id],
                        'info' => 'contact@testcompany.com'
                    ],
                    [
                        'type' => ['id' => $emailType->id],
                        'info' => 'support@testcompany.com'
                    ]
                ]
            ]);

        $response->assertStatus(201);

        $company = Company::where('name', 'Test Company')->first();
        $this->assertNotNull($company);

        // Verify emails were created
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $company->id,
            'emailable_type' => 'company',
            'communication_type_id' => $emailType->id,
            'info' => 'contact@testcompany.com'
        ]);

        $this->assertDatabaseHas('emails', [
            'emailable_id' => $company->id,
            'emailable_type' => 'company',
            'communication_type_id' => $emailType->id,
            'info' => 'support@testcompany.com'
        ]);

        $this->assertEquals(2, $company->emails()->count());
    }

    public function test_store_company_with_phones()
    {
        $phoneType = CommunicationType::factory()->create([
            'team_id' => $this->team->id,
            'type' => 'phone'
        ]);

        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => 'Test Company',
                'phones' => [
                    [
                        'type' => ['id' => $phoneType->id],
                        'info' => '+1-555-123-4567'
                    ],
                    [
                        'type' => ['id' => $phoneType->id],
                        'info' => '+1-555-987-6543'
                    ]
                ]
            ]);

        $response->assertStatus(201);

        $company = Company::where('name', 'Test Company')->first();
        $this->assertNotNull($company);

        // Verify phones were created
        $this->assertDatabaseHas('phones', [
            'phoneable_id' => $company->id,
            'phoneable_type' => 'company',
            'communication_type_id' => $phoneType->id,
            'info' => '+1-555-123-4567'
        ]);

        $this->assertDatabaseHas('phones', [
            'phoneable_id' => $company->id,
            'phoneable_type' => 'company',
            'communication_type_id' => $phoneType->id,
            'info' => '+1-555-987-6543'
        ]);

        $this->assertEquals(2, $company->phones()->count());
    }

    public function test_store_company_with_messengers()
    {
        $messengerType = MessengerType::factory()->create();

        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => 'Test Company',
                'messengers' => [
                    [
                        'type' => ['id' => $messengerType->id],
                        'info' => 'testcompany_messenger'
                    ],
                    [
                        'type' => ['id' => $messengerType->id],
                        'info' => 'testcompany_support'
                    ]
                ]
            ]);

        $response->assertStatus(201);

        $company = Company::where('name', 'Test Company')->first();
        $this->assertNotNull($company);

        // Verify messengers were created
        $this->assertDatabaseHas('messengers', [
            'messengerable_id' => $company->id,
            'messengerable_type' => 'company',
            'messenger_type_id' => $messengerType->id,
            'info' => 'testcompany_messenger'
        ]);

        $this->assertDatabaseHas('messengers', [
            'messengerable_id' => $company->id,
            'messengerable_type' => 'company',
            'messenger_type_id' => $messengerType->id,
            'info' => 'testcompany_support'
        ]);

        $this->assertEquals(2, $company->messengers()->count());
    }

    public function test_store_company_with_social_medias()
    {
        $socialMediaType = SocialMediaType::factory()->create();

        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => 'Test Company',
                'social_medias' => [
                    [
                        'type' => ['id' => $socialMediaType->id],
                        'info' => 'testcompany_social'
                    ],
                    [
                        'type' => ['id' => $socialMediaType->id],
                        'info' => 'testcompany_official'
                    ]
                ]
            ]);

        $response->assertStatus(201);

        $company = Company::where('name', 'Test Company')->first();
        $this->assertNotNull($company);

        // Verify social medias were created
        $this->assertDatabaseHas('social_media', [
            'social_mediaable_id' => $company->id,
            'social_mediaable_type' => 'company',
            'social_media_type_id' => $socialMediaType->id,
            'info' => 'testcompany_social'
        ]);

        $this->assertDatabaseHas('social_media', [
            'social_mediaable_id' => $company->id,
            'social_mediaable_type' => 'company',
            'social_media_type_id' => $socialMediaType->id,
            'info' => 'testcompany_official'
        ]);

        $this->assertEquals(2, $company->socialMedias()->count());
    }

    public function test_store_company_with_weblinks()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => 'Test Company',
                'weblinks' => [
                    [
                        'info' => 'https://www.testcompany.com'
                    ],
                    [
                        'info' => 'https://blog.testcompany.com'
                    ]
                ]
            ]);

        $response->assertStatus(201);

        $company = Company::where('name', 'Test Company')->first();
        $this->assertNotNull($company);

        // Verify weblinks were created
        $this->assertDatabaseHas('weblinks', [
            'weblinkable_id' => $company->id,
            'weblinkable_type' => 'company',
            'info' => 'https://www.testcompany.com'
        ]);

        $this->assertDatabaseHas('weblinks', [
            'weblinkable_id' => $company->id,
            'weblinkable_type' => 'company',
            'info' => 'https://blog.testcompany.com'
        ]);

        $this->assertEquals(2, $company->weblinks()->count());
    }

    public function test_store_company_with_all_relationships()
    {
        $communicationType = CommunicationType::factory()->create([
            'team_id' => $this->team->id,
            'type' => 'address'
        ]);
        $messengerType = MessengerType::factory()->create();
        $socialMediaType = SocialMediaType::factory()->create();

        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => 'Complete Test Company',
                'addresses' => [
                    [
                        'type' => ['id' => $communicationType->id],
                        'info' => '123 Complete St'
                    ]
                ],
                'emails' => [
                    [
                        'type' => ['id' => $communicationType->id],
                        'info' => 'complete@test.com'
                    ]
                ],
                'phones' => [
                    [
                        'type' => ['id' => $communicationType->id],
                        'info' => '+1-555-COMPLETE'
                    ]
                ],
                'messengers' => [
                    [
                        'type' => ['id' => $messengerType->id],
                        'info' => 'complete_messenger'
                    ]
                ],
                'social_medias' => [
                    [
                        'type' => ['id' => $socialMediaType->id],
                        'info' => 'complete_social'
                    ]
                ],
                'weblinks' => [
                    [
                        'info' => 'https://complete.test.com'
                    ]
                ]
            ]);

        $response->assertStatus(201);

        $company = Company::where('name', 'Complete Test Company')->first();
        $this->assertNotNull($company);

        // Verify all relationships were created
        $this->assertEquals(1, $company->addresses()->count());
        $this->assertEquals(1, $company->emails()->count());
        $this->assertEquals(1, $company->phones()->count());
        $this->assertEquals(1, $company->messengers()->count());
        $this->assertEquals(1, $company->socialMedias()->count());
        $this->assertEquals(1, $company->weblinks()->count());
    }

    public function test_update_company_with_existing_relationships()
    {
        $company = Company::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $communicationType = CommunicationType::factory()->create([
            'team_id' => $this->team->id,
            'type' => 'email'
        ]);

        // Create existing email
        $existingEmail = Email::factory()->create([
            'emailable_id' => $company->id,
            'emailable_type' => 'company',
            'communication_type_id' => $communicationType->id,
            'info' => 'old@company.com'
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('companies.update', $company), [
                'name' => 'Updated Company',
                'emails' => [
                    [
                        'id' => $existingEmail->id,
                        'type' => ['id' => $communicationType->id],
                        'info' => 'updated@company.com'
                    ],
                    [
                        'type' => ['id' => $communicationType->id],
                        'info' => 'new@company.com'
                    ]
                ]
            ]);

        $response->assertStatus(200);

        // Verify existing email was updated
        $this->assertDatabaseHas('emails', [
            'id' => $existingEmail->id,
            'emailable_id' => $company->id,
            'emailable_type' => 'company',
            'info' => 'updated@company.com'
        ]);

        // Verify new email was created
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $company->id,
            'emailable_type' => 'company',
            'info' => 'new@company.com'
        ]);

        $this->assertEquals(2, $company->emails()->count());
    }

    public function test_update_company_removes_unspecified_relationships()
    {
        $company = Company::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Create existing weblinks
        $keepWeblink = Weblink::factory()->create([
            'weblinkable_id' => $company->id,
            'weblinkable_type' => 'company',
            'info' => 'https://keep.com'
        ]);

        $removeWeblink = Weblink::factory()->create([
            'weblinkable_id' => $company->id,
            'weblinkable_type' => 'company',
            'info' => 'https://remove.com'
        ]);

        // Update with only one weblink (the other should be removed)
        $response = $this->actingAs($this->user)
            ->putJson(route('companies.update', $company), [
                'name' => 'Updated Company',
                'weblinks' => [
                    [
                        'id' => $keepWeblink->id,
                        'info' => 'https://kept.com'
                    ]
                ]
            ]);

        $response->assertStatus(200);

        // Verify kept weblink was updated
        $this->assertDatabaseHas('weblinks', [
            'id' => $keepWeblink->id,
            'weblinkable_id' => $company->id,
            'info' => 'https://kept.com'
        ]);

        // Verify removed weblink was deleted
        $this->assertDatabaseMissing('weblinks', [
            'id' => $removeWeblink->id
        ]);

        $this->assertEquals(1, $company->weblinks()->count());
    }

    public function test_show_company_includes_all_relationships()
    {
        $company = Company::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $communicationType = CommunicationType::factory()->create([
            'team_id' => $this->team->id,
            'type' => 'email'
        ]);
        $messengerType = MessengerType::factory()->create();
        $socialMediaType = SocialMediaType::factory()->create();

        // Create relationships
        Address::factory()->create([
            'addressable_id' => $company->id,
            'addressable_type' => 'company',
            'communication_type_id' => $communicationType->id,
            'info' => 'Test Address'
        ]);

        Email::factory()->create([
            'emailable_id' => $company->id,
            'emailable_type' => 'company',
            'communication_type_id' => $communicationType->id,
            'info' => 'test@company.com'
        ]);

        Phone::factory()->create([
            'phoneable_id' => $company->id,
            'phoneable_type' => 'company',
            'communication_type_id' => $communicationType->id,
            'info' => '+1-555-TEST'
        ]);

        Messenger::factory()->create([
            'messengerable_id' => $company->id,
            'messengerable_type' => 'company',
            'messenger_type_id' => $messengerType->id,
            'info' => 'test_messenger'
        ]);

        SocialMedia::factory()->create([
            'social_mediaable_id' => $company->id,
            'social_mediaable_type' => 'company',
            'social_media_type_id' => $socialMediaType->id,
            'info' => 'test_social'
        ]);

        Weblink::factory()->create([
            'weblinkable_id' => $company->id,
            'weblinkable_type' => 'company',
            'info' => 'https://test.com'
        ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('companies.show', $company));

        $response->assertStatus(200);

        // Verify all relationships are included in response
        $response->assertJsonStructure([
            'id',
            'name',
            'addresses' => [
                '*' => ['id', 'info', 'type']
            ],
            'emails' => [
                '*' => ['id', 'info', 'type']
            ],
            'phones' => [
                '*' => ['id', 'info', 'type']
            ],
            'messengers' => [
                '*' => ['id', 'info', 'type']
            ],
            'social_medias' => [
                '*' => ['id', 'info', 'type']
            ],
            'weblinks' => [
                '*' => ['id', 'info']
            ],
            'contacts',
            'created_by',
            'updated_by'
        ]);

        $responseData = $response->json();
        $this->assertCount(1, $responseData['addresses']);
        $this->assertCount(1, $responseData['emails']);
        $this->assertCount(1, $responseData['phones']);
        $this->assertCount(1, $responseData['messengers']);
        $this->assertCount(1, $responseData['social_medias']);
        $this->assertCount(1, $responseData['weblinks']);
    }

    public function test_show_company_uses_contact_basic_resource()
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
            'first_name' => 'John',
            'last_name' => 'Doe'
        ]);

        // Attach contact with job title
        $company->contacts()->attach($contact->id, ['job_title' => 'Senior Developer']);

        $response = $this->actingAs($this->user)
            ->getJson(route('companies.show', $company));

        $response->assertStatus(200)
            ->assertJson([
                'contacts' => [
                    [
                        'id' => $contact->id,
                        'first_name' => 'John',
                        'last_name' => 'Doe',
                        'job_title' => 'Senior Developer'
                    ]
                ]
            ]);

        // Verify ContactBasicResource structure (should only have id, first_name, last_name, job_title)
        $contactData = $response->json('contacts.0');
        $this->assertArrayHasKey('id', $contactData);
        $this->assertArrayHasKey('first_name', $contactData);
        $this->assertArrayHasKey('last_name', $contactData);
        $this->assertArrayHasKey('job_title', $contactData);
        $this->assertArrayNotHasKey('notes', $contactData); // Full contact data should not be included
        $this->assertArrayNotHasKey('created_at', $contactData);
    }

    public function test_store_company_with_empty_relationship_arrays()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('companies.store'), [
                'name' => 'Test Company',
                'addresses' => [],
                'emails' => [],
                'phones' => [],
                'messengers' => [],
                'social_medias' => [],
                'weblinks' => []
            ]);

        $response->assertStatus(201);

        $company = Company::where('name', 'Test Company')->first();
        $this->assertNotNull($company);

        // Verify no relationships were created
        $this->assertEquals(0, $company->addresses()->count());
        $this->assertEquals(0, $company->emails()->count());
        $this->assertEquals(0, $company->phones()->count());
        $this->assertEquals(0, $company->messengers()->count());
        $this->assertEquals(0, $company->socialMedias()->count());
        $this->assertEquals(0, $company->weblinks()->count());
    }
}
