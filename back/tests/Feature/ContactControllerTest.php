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
                        'pivot' => [
                            'job_title' => 'Developer'
                        ]
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
} 