<?php

namespace Tests\Feature;

use Tests\TestCase;
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

class ContactControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $team;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a team and user
        $this->team = Team::factory()->create();
        $this->user = User::factory()->create(['team_id' => $this->team->id]);
    }

    public function test_store_contact_requires_first_name_and_last_name()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('contacts.store'), [
                'first_name' => '',
                'last_name' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['first_name', 'last_name']);
    }

    public function test_store_contact_with_minimal_data()
    {
        $response = $this->actingAs($this->user)
            ->postJson(route('contacts.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'first_name' => 'John',
                'last_name' => 'Doe',
            ]);

        $this->assertDatabaseHas('contacts', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);
    }

    public function test_store_contact_with_optional_fields()
    {
        // Create necessary types
        $emailType = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $this->team->id]);
        $phoneType = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $this->team->id]);
        $addressType = CommunicationType::factory()->create(['type' => 'address', 'team_id' => $this->team->id]);
        $messengerType = MessengerType::factory()->create();
        $socialMediaType = SocialMediaType::factory()->create();
        $company = Company::factory()->create(['team_id' => $this->team->id]);

        // Use factories to generate realistic test data
        $phoneData = Phone::factory()->make(['communication_type_id' => $phoneType->id])->toArray();
        $emailData = Email::factory()->make(['communication_type_id' => $emailType->id])->toArray();
        $addressData = Address::factory()->make(['communication_type_id' => $addressType->id])->toArray();
        $messengerData = Messenger::factory()->make(['messenger_type_id' => $messengerType->id])->toArray();
        $socialMediaData = SocialMedia::factory()->make(['social_media_type_id' => $socialMediaType->id])->toArray();
        $weblinkData = Weblink::factory()->make()->only(['info']);

        $response = $this->actingAs($this->user)
            ->postJson(route('contacts.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'notes' => 'Test note',
                'companies' => [
                    [
                        'id' => $company->id,
                        'job_title' => 'Developer'
                    ]
                ],
                'phones' => [
                    [
                        'type' => [
                            'id' => $phoneData['communication_type_id']
                        ],
                        'info' => $phoneData['info']
                    ]
                ],
                'emails' => [
                    [
                        'type' => [
                            'id' => $emailData['communication_type_id']
                        ],
                        'info' => $emailData['info']
                    ]
                ],
                'addresses' => [
                    [
                        'type' => [
                            'id' => $addressData['communication_type_id']
                        ],
                        'info' => $addressData['info']
                    ]
                ],
                'messengers' => [
                    [
                        'type' => ['id' => $messengerData['messenger_type_id']],
                        'info' => $messengerData['info']
                    ]
                ],
                'social_medias' => [
                    [
                        'type' => ['id' => $socialMediaData['social_media_type_id']],
                        'info' => $socialMediaData['info']
                    ]
                ],
                'weblinks' => [$weblinkData]
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'first_name' => 'John',
                'last_name' => 'Doe',
                'notes' => 'Test note',
            ]);

        // Check contact was created
        $contact = Contact::where('first_name', 'John')->where('last_name', 'Doe')->first();
        $this->assertNotNull($contact);

        // Check company relationship
        $this->assertDatabaseHas('company_contact', [
            'company_id' => $company->id,
            'contact_id' => $contact->id,
            'job_title' => 'Developer'
        ]);

        // Check phone was created
        $this->assertDatabaseHas('phones', [
            'phoneable_id' => $contact->id,
            'phoneable_type' => 'contact',
            'communication_type_id' => $phoneData['communication_type_id'],
            'info' => $phoneData['info']
        ]);

        // Check email was created
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $contact->id,
            'emailable_type' => 'contact',
            'communication_type_id' => $emailData['communication_type_id'],
            'info' => $emailData['info']
        ]);

        // Check address was created
        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $addressData['communication_type_id'],
            'info' => $addressData['info']
        ]);

        // Check messenger was created
        $this->assertDatabaseHas('messengers', [
            'messengerable_id' => $contact->id,
            'messengerable_type' => 'contact',
            'messenger_type_id' => $messengerData['messenger_type_id'],
            'info' => $messengerData['info']
        ]);

        // Check social media was created
        $this->assertDatabaseHas('social_media', [
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaData['social_media_type_id'],
            'info' => $socialMediaData['info']
        ]);

        // Check weblink was created
        $this->assertDatabaseHas('weblinks', array_merge([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ], $weblinkData));
    }

    public function test_unauthorized_user_cannot_create_contact()
    {
        $response = $this->postJson(route('contacts.store'), [
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $response->assertStatus(401);
    }

    public function test_store_contact_with_addresses()
    {
        $communicationType = CommunicationType::factory()->create([
            'team_id' => $this->team->id,
            'type' => 'address'
        ]);

        $response = $this->actingAs($this->user)
            ->postJson(route('contacts.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
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

        $contact = Contact::where('first_name', 'John')->where('last_name', 'Doe')->first();
        $this->assertNotNull($contact);

        // Verify addresses were created
        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $communicationType->id,
            'info' => '123 Main St, City, State 12345'
        ]);

        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $communicationType->id,
            'info' => '456 Work Ave, Business District'
        ]);

        $this->assertEquals(2, $contact->addresses()->count());
    }

    public function test_store_contact_with_social_medias()
    {
        $socialMediaType = SocialMediaType::factory()->create();

        $response = $this->actingAs($this->user)
            ->postJson(route('contacts.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'social_medias' => [
                    [
                        'type' => ['id' => $socialMediaType->id],
                        'info' => 'john_doe_contact'
                    ],
                    [
                        'type' => ['id' => $socialMediaType->id],
                        'info' => 'john.doe.official'
                    ]
                ]
            ]);

        $response->assertStatus(201);

        $contact = Contact::where('first_name', 'John')->where('last_name', 'Doe')->first();
        $this->assertNotNull($contact);

        // Verify social medias were created
        $this->assertDatabaseHas('social_media', [
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaType->id,
            'info' => 'john_doe_contact'
        ]);

        $this->assertDatabaseHas('social_media', [
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaType->id,
            'info' => 'john.doe.official'
        ]);

        $this->assertEquals(2, $contact->socialMedias()->count());
    }

    public function test_update_contact_basic_info()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'notes' => 'Old note',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => 'Updated',
                'last_name' => 'Name',
                'notes' => 'New note',
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Updated',
                'last_name' => 'Name',
                'notes' => 'New note',
            ]);

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'notes' => 'New note',
            'updated_by' => $this->user->id,
        ]);
    }

    public function test_update_contact_company_relationship()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $oldCompany = Company::factory()->create(['team_id' => $this->team->id]);
        $newCompany = Company::factory()->create(['team_id' => $this->team->id]);

        // Initial company relationship
        $contact->companies()->attach($oldCompany->id, ['job_title' => 'Developer']);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [
                    [
                        'id' => $newCompany->id,
                        'job_title' => 'Manager'
                    ]
                ],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [],
            ]);

        $response->assertStatus(200);

        // Check old company relationship was removed
        $this->assertDatabaseMissing('company_contact', [
            'company_id' => $oldCompany->id,
            'contact_id' => $contact->id,
        ]);

        // Check new company relationship was added
        $this->assertDatabaseHas('company_contact', [
            'company_id' => $newCompany->id,
            'contact_id' => $contact->id,
            'job_title' => 'Manager'
        ]);
    }

    public function test_update_contact_phones()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $phoneType1 = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $this->team->id]);
        $phoneType2 = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $this->team->id]);
        $phoneType3 = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $this->team->id]); // For new phone

        // Create initial phones using factories
        $existingPhone1 = Phone::factory()->create([
            'phoneable_id' => $contact->id,
            'phoneable_type' => 'contact',
            'communication_type_id' => $phoneType1->id,
        ]);

        $existingPhone2 = Phone::factory()->create([
            'phoneable_id' => $contact->id,
            'phoneable_type' => 'contact',
            'communication_type_id' => $phoneType2->id,
        ]);

        // Generate realistic update data using factories
        $updatedPhone1Data = Phone::factory()->make(['communication_type_id' => $phoneType1->id])->only(['info']);
        $updatedPhone2Data = Phone::factory()->make(['communication_type_id' => $phoneType2->id])->only(['info']);
        $newPhoneData = Phone::factory()->make(['communication_type_id' => $phoneType3->id])->only(['info']);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [
                    // Update first existing phone
                    [
                        'id' => $existingPhone1->id,
                        'type' => [
                            'id' => $phoneType1->id
                        ],
                        'info' => $updatedPhone1Data['info']
                    ],
                    // Update second existing phone
                    [
                        'id' => $existingPhone2->id,
                        'type' => [
                            'id' => $phoneType2->id
                        ],
                        'info' => $updatedPhone2Data['info']
                    ],
                    // Add new phone
                    [
                        'type' => [
                            'id' => $phoneType3->id
                        ],
                        'info' => $newPhoneData['info']
                    ]
                ],
                'emails' => [],
                'messengers' => [],
            ]);

        $response->assertStatus(200);

        // Check first phone was updated
        $this->assertDatabaseHas('phones', [
            'id' => $existingPhone1->id,
            'phoneable_id' => $contact->id,
            'phoneable_type' => 'contact',
            'communication_type_id' => $phoneType1->id,
            'info' => $updatedPhone1Data['info']
        ]);

        // Check second phone was updated
        $this->assertDatabaseHas('phones', [
            'id' => $existingPhone2->id,
            'phoneable_id' => $contact->id,
            'phoneable_type' => 'contact',
            'communication_type_id' => $phoneType2->id,
            'info' => $updatedPhone2Data['info']
        ]);

        // Check new phone was added
        $this->assertDatabaseHas('phones', [
            'phoneable_id' => $contact->id,
            'phoneable_type' => 'contact',
            'communication_type_id' => $phoneType3->id,
            'info' => $newPhoneData['info']
        ]);

        // Check total count of phones
        $this->assertEquals(3, $contact->fresh()->phones()->count());
    }

    public function test_delete_contact_phone()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $phoneType = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $this->team->id]);

        // Create initial phone using factory
        $existingPhone = Phone::factory()->create([
            'phoneable_id' => $contact->id,
            'phoneable_type' => 'contact',
            'communication_type_id' => $phoneType->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [], // No phones, should delete existing
                'emails' => [],
                'messengers' => [],
            ]);

        $response->assertStatus(200);

        // Check phone was deleted
        $this->assertDatabaseMissing('phones', [
            'id' => $existingPhone->id
        ]);

        // Check total count of phones
        $this->assertEquals(0, $contact->fresh()->phones()->count());
    }

    public function test_update_contact_emails()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $emailType1 = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $this->team->id]);
        $emailType2 = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $this->team->id]);
        $emailType3 = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $this->team->id]); // For new email

        // Create initial emails using factories
        $existingEmail1 = Email::factory()->create([
            'emailable_id' => $contact->id,
            'emailable_type' => 'contact',
            'communication_type_id' => $emailType1->id,
        ]);

        $existingEmail2 = Email::factory()->create([
            'emailable_id' => $contact->id,
            'emailable_type' => 'contact',
            'communication_type_id' => $emailType2->id,
        ]);

        // Generate realistic update data using factories
        $updatedEmail1Data = Email::factory()->make(['communication_type_id' => $emailType1->id])->only(['info']);
        $updatedEmail2Data = Email::factory()->make(['communication_type_id' => $emailType2->id])->only(['info']);
        $newEmailData = Email::factory()->make(['communication_type_id' => $emailType3->id])->only(['info']);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [
                    // Update first existing email
                    [
                        'id' => $existingEmail1->id,
                        'type' => [
                            'id' => $emailType1->id
                        ],
                        'info' => $updatedEmail1Data['info']
                    ],
                    // Update second existing email
                    [
                        'id' => $existingEmail2->id,
                        'type' => [
                            'id' => $emailType2->id
                        ],
                        'info' => $updatedEmail2Data['info']
                    ],
                    // Add new email
                    [
                        'type' => [
                            'id' => $emailType3->id
                        ],
                        'info' => $newEmailData['info']
                    ]
                ],
                'messengers' => [],
            ]);

        $response->assertStatus(200);

        // Check first email was updated
        $this->assertDatabaseHas('emails', [
            'id' => $existingEmail1->id,
            'emailable_id' => $contact->id,
            'emailable_type' => 'contact',
            'communication_type_id' => $emailType1->id,
            'info' => $updatedEmail1Data['info']
        ]);

        // Check second email was updated
        $this->assertDatabaseHas('emails', [
            'id' => $existingEmail2->id,
            'emailable_id' => $contact->id,
            'emailable_type' => 'contact',
            'communication_type_id' => $emailType2->id,
            'info' => $updatedEmail2Data['info']
        ]);

        // Check new email was added
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $contact->id,
            'emailable_type' => 'contact',
            'communication_type_id' => $emailType3->id,
            'info' => $newEmailData['info']
        ]);

        // Check total count of emails
        $this->assertEquals(3, $contact->fresh()->emails()->count());
    }

    public function test_delete_contact_email()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $emailType = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $this->team->id]);

        // Create initial email using factory
        $existingEmail = Email::factory()->create([
            'emailable_id' => $contact->id,
            'emailable_type' => 'contact',
            'communication_type_id' => $emailType->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [], // No emails, should delete existing
                'messengers' => [],
            ]);

        $response->assertStatus(200);

        // Check email was deleted
        $this->assertDatabaseMissing('emails', [
            'id' => $existingEmail->id
        ]);

        // Check total count of emails
        $this->assertEquals(0, $contact->fresh()->emails()->count());
    }

    public function test_update_contact_messengers()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $messengerType1 = MessengerType::factory()->create();
        $messengerType2 = MessengerType::factory()->create();
        $messengerType3 = MessengerType::factory()->create(); // For new messenger

        // Create initial messengers using factories
        $existingMessenger1 = Messenger::factory()->create([
            'messengerable_id' => $contact->id,
            'messengerable_type' => 'contact',
            'messenger_type_id' => $messengerType1->id,
        ]);

        $existingMessenger2 = Messenger::factory()->create([
            'messengerable_id' => $contact->id,
            'messengerable_type' => 'contact',
            'messenger_type_id' => $messengerType2->id,
        ]);

        // Generate realistic update data using factories
        $updatedMessenger1Data = Messenger::factory()->make(['messenger_type_id' => $messengerType1->id])->only(['info']);
        $updatedMessenger2Data = Messenger::factory()->make(['messenger_type_id' => $messengerType2->id])->only(['info']);
        $newMessengerData = Messenger::factory()->make(['messenger_type_id' => $messengerType3->id])->only(['info']);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [
                    // Update first existing messenger
                    [
                        'id' => $existingMessenger1->id,
                        'type' => ['id' => $messengerType1->id],
                        'info' => $updatedMessenger1Data['info']
                    ],
                    // Update second existing messenger
                    [
                        'id' => $existingMessenger2->id,
                        'type' => ['id' => $messengerType2->id],
                        'info' => $updatedMessenger2Data['info']
                    ],
                    // Add new messenger
                    [
                        'type' => ['id' => $messengerType3->id],
                        'info' => $newMessengerData['info']
                    ]
                ],
            ]);

        $response->assertStatus(200);

        // Check first messenger was updated
        $this->assertDatabaseHas('messengers', [
            'id' => $existingMessenger1->id,
            'messengerable_id' => $contact->id,
            'messengerable_type' => 'contact',
            'messenger_type_id' => $messengerType1->id,
            'info' => $updatedMessenger1Data['info']
        ]);

        // Check second messenger was updated
        $this->assertDatabaseHas('messengers', [
            'id' => $existingMessenger2->id,
            'messengerable_id' => $contact->id,
            'messengerable_type' => 'contact',
            'messenger_type_id' => $messengerType2->id,
            'info' => $updatedMessenger2Data['info']
        ]);

        // Check new messenger was added
        $this->assertDatabaseHas('messengers', [
            'messengerable_id' => $contact->id,
            'messengerable_type' => 'contact',
            'messenger_type_id' => $messengerType3->id,
            'info' => $newMessengerData['info']
        ]);

        // Check total count of messengers
        $this->assertEquals(3, $contact->fresh()->messengers()->count());
    }

    public function test_delete_contact_messenger()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $messengerType = MessengerType::factory()->create();

        // Create initial messenger using factory
        $existingMessenger = Messenger::factory()->create([
            'messengerable_id' => $contact->id,
            'messengerable_type' => 'contact',
            'messenger_type_id' => $messengerType->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [], // No messengers, should delete existing
            ]);

        $response->assertStatus(200);

        // Check messenger was deleted
        $this->assertDatabaseMissing('messengers', [
            'id' => $existingMessenger->id
        ]);

        // Check total count of messengers
        $this->assertEquals(0, $contact->fresh()->messengers()->count());
    }

    public function test_unauthorized_user_cannot_update_contact()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Create another user in a different team
        $otherTeam = Team::factory()->create();
        /** @var \App\Models\User $otherUser */
        $otherUser = User::factory()->create(['team_id' => $otherTeam->id]);

        $response = $this->actingAs($otherUser)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => 'Unauthorized',
                'last_name' => 'Update',
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
            ]);

        $response->assertStatus(403); // Forbidden
    }

    public function test_update_contact_with_all_relationships()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
            'first_name' => 'Original',
            'last_name' => 'Name',
        ]);

        $company = Company::factory()->create(['team_id' => $this->team->id]);
        $phoneType = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $this->team->id]);
        $emailType = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $this->team->id]);
        $addressType = CommunicationType::factory()->create(['type' => 'address', 'team_id' => $this->team->id]);
        $messengerType = MessengerType::factory()->create();
        $socialMediaType = SocialMediaType::factory()->create();

        // Generate realistic test data using factories
        $phoneData = Phone::factory()->make(['communication_type_id' => $phoneType->id])->only(['communication_type_id', 'info']);
        $emailData = Email::factory()->make(['communication_type_id' => $emailType->id])->only(['communication_type_id', 'info']);
        $addressData = Address::factory()->make(['communication_type_id' => $addressType->id])->only(['communication_type_id', 'info']);
        $messengerData = Messenger::factory()->make(['messenger_type_id' => $messengerType->id])->only(['messenger_type_id', 'info']);
        $socialMediaData = SocialMedia::factory()->make(['social_media_type_id' => $socialMediaType->id])->only(['social_media_type_id', 'info']);
        $weblinkData = Weblink::factory()->make()->only(['info']);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => 'Complete',
                'last_name' => 'Update',
                'notes' => 'Full update test',
                'companies' => [
                    [
                        'id' => $company->id,
                        'job_title' => 'Senior Developer'
                    ]
                ],
                'phones' => [
                    [
                        'type' => [
                            'id' => $phoneData['communication_type_id']
                        ],
                        'info' => $phoneData['info']
                    ]
                ],
                'emails' => [
                    [
                        'type' => [
                            'id' => $emailData['communication_type_id']
                        ],
                        'info' => $emailData['info']
                    ]
                ],
                'addresses' => [
                    [
                        'type' => [
                            'id' => $addressData['communication_type_id']
                        ],
                        'info' => $addressData['info']
                    ]
                ],
                'messengers' => [
                    [
                        'type' => ['id' => $messengerData['messenger_type_id']],
                        'info' => $messengerData['info']
                    ]
                ],
                'social_medias' => [
                    [
                        'type' => ['id' => $socialMediaData['social_media_type_id']],
                        'info' => $socialMediaData['info']
                    ]
                ],
                'weblinks' => [$weblinkData]
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Complete',
                'last_name' => 'Update',
                'notes' => 'Full update test',
            ]);

        // Check contact was updated
        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'first_name' => 'Complete',
            'last_name' => 'Update',
            'notes' => 'Full update test',
        ]);

        // Check company relationship
        $this->assertDatabaseHas('company_contact', [
            'company_id' => $company->id,
            'contact_id' => $contact->id,
            'job_title' => 'Senior Developer'
        ]);

        // Check phone was created
        $this->assertDatabaseHas('phones', array_merge([
            'phoneable_id' => $contact->id,
            'phoneable_type' => 'contact',
        ], $phoneData));

        // Check email was created
        $this->assertDatabaseHas('emails', array_merge([
            'emailable_id' => $contact->id,
            'emailable_type' => 'contact',
        ], $emailData));

        // Check address was created
        $this->assertDatabaseHas('addresses', array_merge([
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
        ], $addressData));

        // Check messenger was created
        $this->assertDatabaseHas('messengers', array_merge([
            'messengerable_id' => $contact->id,
            'messengerable_type' => 'contact',
        ], $messengerData));

        // Check social media was created
        $this->assertDatabaseHas('social_media', array_merge([
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
        ], $socialMediaData));

        // Check weblink was created
        $this->assertDatabaseHas('weblinks', array_merge([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ], $weblinkData));

        // Check updated_by was set correctly
        $this->assertEquals($this->user->id, $contact->fresh()->updated_by);
    }

    public function test_update_contact_addresses()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $addressType1 = CommunicationType::factory()->create(['type' => 'address', 'team_id' => $this->team->id]);
        $addressType2 = CommunicationType::factory()->create(['type' => 'address', 'team_id' => $this->team->id]);

        // Create initial addresses
        $existingAddress1 = Address::factory()->create([
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $addressType1->id,
            'info' => 'Old Address 1',
        ]);

        $existingAddress2 = Address::factory()->create([
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $addressType2->id,
            'info' => 'Old Address 2',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [],
                'addresses' => [
                    // Update first existing address
                    [
                        'id' => $existingAddress1->id,
                        'type' => ['id' => $addressType1->id],
                        'info' => 'Updated Address 1'
                    ],
                    // Update second existing address
                    [
                        'id' => $existingAddress2->id,
                        'type' => ['id' => $addressType2->id],
                        'info' => 'Updated Address 2'
                    ],
                    // Add new address
                    [
                        'type' => ['id' => $addressType1->id],
                        'info' => 'New Address 3'
                    ]
                ]
            ]);

        $response->assertStatus(200);

        // Check first address was updated
        $this->assertDatabaseHas('addresses', [
            'id' => $existingAddress1->id,
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $addressType1->id,
            'info' => 'Updated Address 1'
        ]);

        // Check second address was updated
        $this->assertDatabaseHas('addresses', [
            'id' => $existingAddress2->id,
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $addressType2->id,
            'info' => 'Updated Address 2'
        ]);

        // Check new address was added
        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $addressType1->id,
            'info' => 'New Address 3'
        ]);

        // Check total count of addresses
        $this->assertEquals(3, $contact->fresh()->addresses()->count());
    }

    public function test_update_contact_social_medias()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $socialMediaType1 = SocialMediaType::factory()->create();
        $socialMediaType2 = SocialMediaType::factory()->create();

        // Create initial social medias
        $existingSocialMedia1 = SocialMedia::factory()->create([
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaType1->id,
            'info' => 'old_handle_1',
        ]);

        $existingSocialMedia2 = SocialMedia::factory()->create([
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaType2->id,
            'info' => 'old_handle_2',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [],
                'addresses' => [],
                'social_medias' => [
                    // Update first existing social media
                    [
                        'id' => $existingSocialMedia1->id,
                        'type' => ['id' => $socialMediaType1->id],
                        'info' => 'updated_handle_1'
                    ],
                    // Update second existing social media
                    [
                        'id' => $existingSocialMedia2->id,
                        'type' => ['id' => $socialMediaType2->id],
                        'info' => 'updated_handle_2'
                    ],
                    // Add new social media
                    [
                        'type' => ['id' => $socialMediaType1->id],
                        'info' => 'new_handle_3'
                    ]
                ]
            ]);

        $response->assertStatus(200);

        // Check first social media was updated
        $this->assertDatabaseHas('social_media', [
            'id' => $existingSocialMedia1->id,
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaType1->id,
            'info' => 'updated_handle_1'
        ]);

        // Check second social media was updated
        $this->assertDatabaseHas('social_media', [
            'id' => $existingSocialMedia2->id,
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaType2->id,
            'info' => 'updated_handle_2'
        ]);

        // Check new social media was added
        $this->assertDatabaseHas('social_media', [
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaType1->id,
            'info' => 'new_handle_3'
        ]);

        // Check total count of social medias
        $this->assertEquals(3, $contact->fresh()->socialMedias()->count());
    }

    public function test_update_contact_validation_for_email()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $emailType = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $this->team->id]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'emails' => [
                    [
                        'type' => [
                            'id' => $emailType->id
                        ],
                        'info' => 'invalid-email' // Invalid email format
                    ]
                ],
                'companies' => [],
                'phones' => [],
                'messengers' => [],
                'weblinks' => [],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['emails.0.info']);
    }

    public function test_store_contact_with_weblinks()
    {
        $weblinkData = Weblink::factory()->make()->only(['info']);

        $response = $this->actingAs($this->user)
            ->postJson(route('contacts.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [$weblinkData]
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'first_name' => 'John',
                'last_name' => 'Doe',
            ]);

        // Check contact was created
        $contact = Contact::where('first_name', 'John')->where('last_name', 'Doe')->first();
        $this->assertNotNull($contact);

        // Check weblink was created
        $this->assertDatabaseHas('weblinks', array_merge([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ], $weblinkData));
    }

    public function test_update_contact_weblinks()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Create initial weblinks using factory
        $existingWeblink1 = Weblink::factory()->create([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ]);

        $existingWeblink2 = Weblink::factory()->create([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ]);

        // Generate new weblink data using factory
        $newWeblinkData = Weblink::factory()->make()->only(['info']);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [
                    [
                        'id' => $existingWeblink1->id,
                        'info' => 'https://updated-website.com'
                    ],
                    $newWeblinkData
                ]
            ]);

        $response->assertStatus(200);

        // Check first weblink was updated
        $this->assertDatabaseHas('weblinks', [
            'id' => $existingWeblink1->id,
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
            'info' => 'https://updated-website.com'
        ]);

        // Check second weblink was deleted
        $this->assertDatabaseMissing('weblinks', [
            'id' => $existingWeblink2->id
        ]);

        // Check new weblink was created
        $this->assertDatabaseHas('weblinks', array_merge([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ], $newWeblinkData));

        // Check total count of weblinks
        $this->assertEquals(2, $contact->fresh()->weblinks()->count());
    }

    public function test_delete_contact_weblinks()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Create initial weblinks using factory
        $existingWeblink1 = Weblink::factory()->create([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ]);

        $existingWeblink2 = Weblink::factory()->create([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [], // No weblinks, should delete existing
            ]);

        $response->assertStatus(200);

        // Check weblinks were deleted
        $this->assertDatabaseMissing('weblinks', [
            'id' => $existingWeblink1->id
        ]);

        $this->assertDatabaseMissing('weblinks', [
            'id' => $existingWeblink2->id
        ]);

        // Check total count of weblinks
        $this->assertEquals(0, $contact->fresh()->weblinks()->count());
    }

    public function test_update_contact_with_multiple_weblinks()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        // Generate multiple weblink data using factory
        $weblinkData1 = Weblink::factory()->make()->only(['info']);
        $weblinkData2 = Weblink::factory()->make()->only(['info']);
        $weblinkData3 = Weblink::factory()->make()->only(['info']);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [$weblinkData1, $weblinkData2, $weblinkData3]
            ]);

        $response->assertStatus(200);

        // Check all weblinks were created
        $this->assertDatabaseHas('weblinks', array_merge([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ], $weblinkData1));

        $this->assertDatabaseHas('weblinks', array_merge([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ], $weblinkData2));

        $this->assertDatabaseHas('weblinks', array_merge([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
        ], $weblinkData3));

        // Check total count of weblinks
        $this->assertEquals(3, $contact->fresh()->weblinks()->count());
    }

    public function test_delete_contact_addresses()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $addressType = CommunicationType::factory()->create(['type' => 'address', 'team_id' => $this->team->id]);

        // Create initial addresses
        $existingAddress1 = Address::factory()->create([
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $addressType->id,
        ]);

        $existingAddress2 = Address::factory()->create([
            'addressable_id' => $contact->id,
            'addressable_type' => 'contact',
            'communication_type_id' => $addressType->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [],
                'addresses' => [], // No addresses, should delete existing
                'social_medias' => [],
            ]);

        $response->assertStatus(200);

        // Check addresses were deleted
        $this->assertDatabaseMissing('addresses', [
            'id' => $existingAddress1->id
        ]);

        $this->assertDatabaseMissing('addresses', [
            'id' => $existingAddress2->id
        ]);

        // Check total count of addresses
        $this->assertEquals(0, $contact->fresh()->addresses()->count());
    }

    public function test_delete_contact_social_medias()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);

        $socialMediaType = SocialMediaType::factory()->create();

        // Create initial social medias
        $existingSocialMedia1 = SocialMedia::factory()->create([
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaType->id,
        ]);

        $existingSocialMedia2 = SocialMedia::factory()->create([
            'social_mediaable_id' => $contact->id,
            'social_mediaable_type' => 'contact',
            'social_media_type_id' => $socialMediaType->id,
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
                'weblinks' => [],
                'addresses' => [],
                'social_medias' => [], // No social medias, should delete existing
            ]);

        $response->assertStatus(200);

        // Check social medias were deleted
        $this->assertDatabaseMissing('social_media', [
            'id' => $existingSocialMedia1->id
        ]);

        $this->assertDatabaseMissing('social_media', [
            'id' => $existingSocialMedia2->id
        ]);

        // Check total count of social medias
        $this->assertEquals(0, $contact->fresh()->socialMedias()->count());
    }

    public function test_contact_weblinks_relationship_returns_correct_data()
    {
        $contact = Contact::factory()->create(['team_id' => $this->team->id]);

        $weblink1 = Weblink::factory()->create([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
            'info' => 'https://website1.com'
        ]);

        $weblink2 = Weblink::factory()->create([
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => 'contact',
            'info' => 'https://website2.com'
        ]);

        $weblinks = $contact->weblinks;

        $this->assertCount(2, $weblinks);
        $this->assertEquals('https://website1.com', $weblinks->find($weblink1->id)->info);
        $this->assertEquals('https://website2.com', $weblinks->find($weblink2->id)->info);
    }

    public function test_index_contacts_includes_job_title_and_companies()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
            'job_title' => 'Developer',
            'first_name' => 'Jane',
        ]);
        $company = Company::factory()->create(['team_id' => $this->team->id, 'name' => 'Acme']);
        $contact->companies()->attach($company->id, ['job_title' => 'Senior Dev']);

        $this->actingAs($this->user)
            ->postJson(route('contacts.search'), [])
            ->assertStatus(200)
            ->assertJsonPath('0.id', $contact->id)
            ->assertJsonPath('0.job_title', 'Developer')
            ->assertJsonPath('0.companies.0.name', 'Acme')
            ->assertJsonPath('0.companies.0.job_title', 'Senior Dev');
    }

    public function test_show_contact_returns_job_title()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
            'job_title' => 'Architect',
            'first_name' => 'Bob',
        ]);

        $this->actingAs($this->user)
            ->getJson(route('contacts.show', $contact))
            ->assertStatus(200)
            ->assertJson([
                'id' => $contact->id,
                'first_name' => 'Bob',
                'job_title' => 'Architect',
            ]);
    }
}
