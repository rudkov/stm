<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\Company;
use App\Models\ContactEmail;
use App\Models\ContactMessenger;
use App\Models\ContactPhone;
use App\Models\EmailType;
use App\Models\MessengerType;
use App\Models\PhoneType;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

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
        $emailType = EmailType::factory()->create();
        $phoneType = PhoneType::factory()->create();
        $messengerType = MessengerType::factory()->create();
        $company = Company::factory()->create(['team_id' => $this->team->id]);

        $response = $this->actingAs($this->user)
            ->postJson(route('contacts.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'comment' => 'Test comment',
                'companies' => [
                    [
                        'id' => $company->id,
                        'job_title' => 'Developer'
                    ]
                ],
                'phones' => [
                    [
                        'phone_type_id' => $phoneType->id,
                        'info' => '+1234567890'
                    ]
                ],
                'emails' => [
                    [
                        'email_type_id' => $emailType->id,
                        'info' => 'john@example.com'
                    ]
                ],
                'messengers' => [
                    [
                        'messenger_type_id' => $messengerType->id,
                        'info' => 'johndoe'
                    ]
                ]
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'first_name' => 'John',
                'last_name' => 'Doe',
                'comment' => 'Test comment',
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
        $this->assertDatabaseHas('contact_phones', [
            'contact_id' => $contact->id,
            'phone_type_id' => $phoneType->id,
            'info' => '+1234567890'
        ]);

        // Check email was created
        $this->assertDatabaseHas('contact_emails', [
            'contact_id' => $contact->id,
            'email_type_id' => $emailType->id,
            'info' => 'john@example.com'
        ]);

        // Check messenger was created
        $this->assertDatabaseHas('contact_messengers', [
            'contact_id' => $contact->id,
            'messenger_type_id' => $messengerType->id,
            'info' => 'johndoe'
        ]);
    }

    public function test_unauthorized_user_cannot_create_contact()
    {
        $response = $this->postJson(route('contacts.store'), [
                'first_name' => 'John',
                'last_name' => 'Doe',
            ]);

        $response->assertStatus(401);
    }

    public function test_update_contact_basic_info()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'comment' => 'Old comment',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => 'Updated',
                'last_name' => 'Name',
                'comment' => 'New comment',
                'companies' => [],
                'phones' => [],
                'emails' => [],
                'messengers' => [],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Updated',
                'last_name' => 'Name',
                'comment' => 'New comment',
            ]);

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'comment' => 'New comment',
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
        
        $phoneType1 = PhoneType::factory()->create();
        $phoneType2 = PhoneType::factory()->create();
        $phoneType3 = PhoneType::factory()->create(); // For new phone
        
        // Create initial phones
        $existingPhone1 = ContactPhone::factory()->create([
            'contact_id' => $contact->id,
            'phone_type_id' => $phoneType1->id,
            'info' => '+1234567890'
        ]);
        
        $existingPhone2 = ContactPhone::factory()->create([
            'contact_id' => $contact->id,
            'phone_type_id' => $phoneType2->id,
            'info' => '+0987654321'
        ]);
        
        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'companies' => [],
                'phones' => [
                    // Update first existing phone
                    [
                        'id' => $existingPhone1->id,
                        'phone_type_id' => $phoneType1->id,
                        'info' => '+9876543210' // Changed number
                    ],
                    // Update second existing phone
                    [
                        'id' => $existingPhone2->id,
                        'phone_type_id' => $phoneType2->id,
                        'info' => '+1122334455' // Changed number
                    ],
                    // Add new phone
                    [
                        'phone_type_id' => $phoneType3->id,
                        'info' => '+1111111111'
                    ]
                ],
                'emails' => [],
                'messengers' => [],
            ]);

        $response->assertStatus(200);
        
        // Check first phone was updated
        $this->assertDatabaseHas('contact_phones', [
            'id' => $existingPhone1->id,
            'contact_id' => $contact->id,
            'phone_type_id' => $phoneType1->id,
            'info' => '+9876543210'
        ]);
        
        // Check second phone was updated
        $this->assertDatabaseHas('contact_phones', [
            'id' => $existingPhone2->id,
            'contact_id' => $contact->id,
            'phone_type_id' => $phoneType2->id,
            'info' => '+1122334455'
        ]);

        // Check new phone was added
        $this->assertDatabaseHas('contact_phones', [
            'contact_id' => $contact->id,
            'phone_type_id' => $phoneType3->id,
            'info' => '+1111111111'
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
        
        $phoneType = PhoneType::factory()->create();
        
        // Create initial phone
        $existingPhone = ContactPhone::factory()->create([
            'contact_id' => $contact->id,
            'phone_type_id' => $phoneType->id,
            'info' => '+1234567890'
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
        $this->assertDatabaseMissing('contact_phones', [
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
        
        $emailType1 = EmailType::factory()->create();
        $emailType2 = EmailType::factory()->create();
        $emailType3 = EmailType::factory()->create(); // For new email
        
        // Create initial emails
        $existingEmail1 = ContactEmail::factory()->create([
            'contact_id' => $contact->id,
            'email_type_id' => $emailType1->id,
            'info' => 'old1@example.com'
        ]);
        
        $existingEmail2 = ContactEmail::factory()->create([
            'contact_id' => $contact->id,
            'email_type_id' => $emailType2->id,
            'info' => 'old2@example.com'
        ]);
        
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
                        'email_type_id' => $emailType1->id,
                        'info' => 'updated1@example.com' // Changed email
                    ],
                    // Update second existing email
                    [
                        'id' => $existingEmail2->id,
                        'email_type_id' => $emailType2->id,
                        'info' => 'updated2@example.com' // Changed email
                    ],
                    // Add new email
                    [
                        'email_type_id' => $emailType3->id,
                        'info' => 'new@example.com'
                    ]
                ],
                'messengers' => [],
            ]);

        $response->assertStatus(200);
        
        // Check first email was updated
        $this->assertDatabaseHas('contact_emails', [
            'id' => $existingEmail1->id,
            'contact_id' => $contact->id,
            'email_type_id' => $emailType1->id,
            'info' => 'updated1@example.com'
        ]);
        
        // Check second email was updated
        $this->assertDatabaseHas('contact_emails', [
            'id' => $existingEmail2->id,
            'contact_id' => $contact->id,
            'email_type_id' => $emailType2->id,
            'info' => 'updated2@example.com'
        ]);

        // Check new email was added
        $this->assertDatabaseHas('contact_emails', [
            'contact_id' => $contact->id,
            'email_type_id' => $emailType3->id,
            'info' => 'new@example.com'
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
        
        $emailType = EmailType::factory()->create();
        
        // Create initial email
        $existingEmail = ContactEmail::factory()->create([
            'contact_id' => $contact->id,
            'email_type_id' => $emailType->id,
            'info' => 'test@example.com'
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
        $this->assertDatabaseMissing('contact_emails', [
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
        
        // Create initial messengers
        $existingMessenger1 = ContactMessenger::factory()->create([
            'contact_id' => $contact->id,
            'messenger_type_id' => $messengerType1->id,
            'info' => 'old_username1'
        ]);
        
        $existingMessenger2 = ContactMessenger::factory()->create([
            'contact_id' => $contact->id,
            'messenger_type_id' => $messengerType2->id,
            'info' => 'old_username2'
        ]);
        
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
                        'messenger_type_id' => $messengerType1->id,
                        'info' => 'updated_username1' // Changed username
                    ],
                    // Update second existing messenger
                    [
                        'id' => $existingMessenger2->id,
                        'messenger_type_id' => $messengerType2->id,
                        'info' => 'updated_username2' // Changed username
                    ],
                    // Add new messenger
                    [
                        'messenger_type_id' => $messengerType3->id,
                        'info' => 'new_username'
                    ]
                ],
            ]);

        $response->assertStatus(200);
        
        // Check first messenger was updated
        $this->assertDatabaseHas('contact_messengers', [
            'id' => $existingMessenger1->id,
            'contact_id' => $contact->id,
            'messenger_type_id' => $messengerType1->id,
            'info' => 'updated_username1'
        ]);
        
        // Check second messenger was updated
        $this->assertDatabaseHas('contact_messengers', [
            'id' => $existingMessenger2->id,
            'contact_id' => $contact->id,
            'messenger_type_id' => $messengerType2->id,
            'info' => 'updated_username2'
        ]);

        // Check new messenger was added
        $this->assertDatabaseHas('contact_messengers', [
            'contact_id' => $contact->id,
            'messenger_type_id' => $messengerType3->id,
            'info' => 'new_username'
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
        
        // Create initial messenger
        $existingMessenger = ContactMessenger::factory()->create([
            'contact_id' => $contact->id,
            'messenger_type_id' => $messengerType->id,
            'info' => 'username'
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
        $this->assertDatabaseMissing('contact_messengers', [
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
        $phoneType = PhoneType::factory()->create();
        $emailType = EmailType::factory()->create();
        $messengerType = MessengerType::factory()->create();
        
        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => 'Complete',
                'last_name' => 'Update',
                'comment' => 'Full update test',
                'companies' => [
                    [
                        'id' => $company->id,
                        'job_title' => 'Senior Developer'
                    ]
                ],
                'phones' => [
                    [
                        'phone_type_id' => $phoneType->id,
                        'info' => '+9876543210'
                    ]
                ],
                'emails' => [
                    [
                        'email_type_id' => $emailType->id,
                        'info' => 'complete@example.com'
                    ]
                ],
                'messengers' => [
                    [
                        'messenger_type_id' => $messengerType->id,
                        'info' => 'complete_username'
                    ]
                ],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'first_name' => 'Complete',
                'last_name' => 'Update',
                'comment' => 'Full update test',
            ]);
        
        // Check contact was updated
        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'first_name' => 'Complete',
            'last_name' => 'Update',
            'comment' => 'Full update test',
        ]);
        
        // Check company relationship
        $this->assertDatabaseHas('company_contact', [
            'company_id' => $company->id,
            'contact_id' => $contact->id,
            'job_title' => 'Senior Developer'
        ]);
        
        // Check phone was created
        $this->assertDatabaseHas('contact_phones', [
            'contact_id' => $contact->id,
            'phone_type_id' => $phoneType->id,
            'info' => '+9876543210'
        ]);
        
        // Check email was created
        $this->assertDatabaseHas('contact_emails', [
            'contact_id' => $contact->id,
            'email_type_id' => $emailType->id,
            'info' => 'complete@example.com'
        ]);
        
        // Check messenger was created
        $this->assertDatabaseHas('contact_messengers', [
            'contact_id' => $contact->id,
            'messenger_type_id' => $messengerType->id,
            'info' => 'complete_username'
        ]);
        
        // Check updated_by was set correctly
        $this->assertEquals($this->user->id, $contact->fresh()->updated_by);
    }

    public function test_update_contact_validation_for_email()
    {
        $contact = Contact::factory()->create([
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);
        
        $emailType = EmailType::factory()->create();
        
        $response = $this->actingAs($this->user)
            ->putJson(route('contacts.update', $contact), [
                'first_name' => $contact->first_name,
                'last_name' => $contact->last_name,
                'emails' => [
                    [
                        'email_type_id' => $emailType->id,
                        'info' => 'invalid-email' // Invalid email format
                    ]
                ],
                'companies' => [],
                'phones' => [],
                'messengers' => [],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['emails.0.info']);
    }
} 