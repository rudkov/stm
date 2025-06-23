<?php

namespace Tests\Helpers;

use App\Models\Address;
use App\Models\CommunicationType;
use App\Models\Contact;
use App\Models\Email;
use App\Models\Messenger;
use App\Models\MessengerType;
use App\Models\Phone;
use App\Models\SocialMedia;
use App\Models\SocialMediaType;
use App\Models\Talent;
use App\Models\Team;

/**
 * Helper class demonstrating efficient use of the new morphable factories
 * in tests. This shows best practices for creating realistic test data.
 */
class FactoryTestHelper
{
    /**
     * Create a talent with complete contact information using factories
     */
    public static function createTalentWithCompleteContactInfo(Team $team, int $createdBy): Talent
    {
        // Create the talent
        $talent = new Talent([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'team_id' => $team->id,
            'created_by' => $createdBy,
            'updated_by' => $createdBy,
        ]);
        $talent->save();

        // Create communication types
        $emailType = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $team->id]);
        $phoneType = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $team->id]);
        $addressType = CommunicationType::factory()->create(['type' => 'address', 'team_id' => $team->id]);
        $messengerType = MessengerType::factory()->create();
        $socialMediaType = SocialMediaType::factory()->create();

        // Create morphable relationships using factories
        Address::factory()->count(2)->create([
            'addressable_id' => $talent->id,
            'addressable_type' => 'talent',
            'communication_type_id' => $addressType->id,
        ]);

        Email::factory()->count(3)->create([
            'emailable_id' => $talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $emailType->id,
        ]);

        Phone::factory()->count(2)->create([
            'phoneable_id' => $talent->id,
            'phoneable_type' => 'talent',
            'communication_type_id' => $phoneType->id,
        ]);

        Messenger::factory()->count(2)->create([
            'messengerable_id' => $talent->id,
            'messengerable_type' => 'talent',
            'messenger_type_id' => $messengerType->id,
        ]);

        SocialMedia::factory()->count(4)->create([
            'social_mediaable_id' => $talent->id,
            'social_mediaable_type' => 'talent',
            'social_media_type_id' => $socialMediaType->id,
        ]);

        return $talent->fresh(); // Return fresh instance with relationships loaded
    }

    /**
     * Create a contact with realistic contact information using factories
     */
    public static function createContactWithContactInfo(Team $team, int $createdBy): Contact
    {
        // Create the contact
        $contact = Contact::factory()->create([
            'team_id' => $team->id,
            'created_by' => $createdBy,
            'updated_by' => $createdBy,
        ]);

        // Create communication types
        $emailType = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $team->id]);
        $phoneType = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $team->id]);
        $messengerType = MessengerType::factory()->create();

        // Create morphable relationships using factories
        Email::factory()->count(2)->create([
            'emailable_id' => $contact->id,
            'emailable_type' => 'contact',
            'communication_type_id' => $emailType->id,
        ]);

        Phone::factory()->count(2)->create([
            'phoneable_id' => $contact->id,
            'phoneable_type' => 'contact',
            'communication_type_id' => $phoneType->id,
        ]);

        Messenger::factory()->count(1)->create([
            'messengerable_id' => $contact->id,
            'messengerable_type' => 'contact',
            'messenger_type_id' => $messengerType->id,
        ]);

        return $contact->fresh(); // Return fresh instance with relationships loaded
    }

    /**
     * Generate request data for talent creation using factories
     * This mimics the structure expected by TalentController
     */
    public static function generateTalentRequestData(Team $team): array
    {
        // Create necessary types
        $emailType = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $team->id]);
        $phoneType = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $team->id]);
        $addressType = CommunicationType::factory()->create(['type' => 'address', 'team_id' => $team->id]);
        $messengerType = MessengerType::factory()->create();
        $socialMediaType = SocialMediaType::factory()->create();

        // Generate realistic data using factories
        $addressData = Address::factory()->make(['communication_type_id' => $addressType->id])->only(['info']);
        $emailData = Email::factory()->make(['communication_type_id' => $emailType->id])->only(['info']);
        $phoneData = Phone::factory()->make(['communication_type_id' => $phoneType->id])->only(['info']);
        $messengerData = Messenger::factory()->make(['messenger_type_id' => $messengerType->id])->only(['info']);
        $socialMediaData = SocialMedia::factory()->make(['social_media_type_id' => $socialMediaType->id])->only(['info']);

        return [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'citizenships' => [],
            'languages' => [],
            'relatives' => [],
            'addresses' => [
                array_merge(['type' => ['id' => $addressType->id]], $addressData),
                array_merge(['type' => ['id' => $addressType->id]], Address::factory()->make()->only(['info']))
            ],
            'emails' => [
                array_merge(['type' => ['id' => $emailType->id]], $emailData)
            ],
            'phones' => [
                array_merge(['type' => ['id' => $phoneType->id]], $phoneData)
            ],
            'messengers' => [
                array_merge(['messenger_type_id' => $messengerType->id], $messengerData)
            ],
            'social_medias' => [
                array_merge(['social_media_type_id' => $socialMediaType->id], $socialMediaData)
            ]
        ];
    }

    /**
     * Generate request data for contact creation using factories
     * This mimics the structure expected by ContactController
     */
    public static function generateContactRequestData(Team $team): array
    {
        // Create necessary types
        $emailType = CommunicationType::factory()->create(['type' => 'email', 'team_id' => $team->id]);
        $phoneType = CommunicationType::factory()->create(['type' => 'phone', 'team_id' => $team->id]);
        $messengerType = MessengerType::factory()->create();

        // Generate realistic data using factories
        $emailData = Email::factory()->make(['communication_type_id' => $emailType->id])->only(['communication_type_id', 'info']);
        $phoneData = Phone::factory()->make(['communication_type_id' => $phoneType->id])->only(['communication_type_id', 'info']);
        $messengerData = Messenger::factory()->make(['messenger_type_id' => $messengerType->id])->only(['messenger_type_id', 'info']);

        return [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'comment' => 'Created using factory helpers',
            'companies' => [],
            'emails' => [$emailData],
            'phones' => [$phoneData],
            'messengers' => [$messengerData],
        ];
    }

    /**
     * Example of creating test data for integration tests
     * This shows how to create complex scenarios efficiently
     */
    public static function createIntegrationTestScenario(Team $team, int $userId): array
    {
        // Create multiple talents and contacts with relationships
        $talents = collect();
        $contacts = collect();

        // Create 3 talents with varying amounts of contact info
        for ($i = 1; $i <= 3; $i++) {
            $talent = self::createTalentWithCompleteContactInfo($team, $userId);
            $talents->push($talent);
        }

        // Create 2 contacts with contact info
        for ($i = 1; $i <= 2; $i++) {
            $contact = self::createContactWithContactInfo($team, $userId);
            $contacts->push($contact);
        }

        return [
            'talents' => $talents,
            'contacts' => $contacts,
            'total_addresses' => $talents->sum(fn($t) => $t->addresses()->count()),
            'total_emails' => $talents->sum(fn($t) => $t->emails()->count()) + $contacts->sum(fn($c) => $c->emails()->count()),
            'total_phones' => $talents->sum(fn($t) => $t->phones()->count()) + $contacts->sum(fn($c) => $c->phones()->count()),
            'total_messengers' => $talents->sum(fn($t) => $t->messengers()->count()) + $contacts->sum(fn($c) => $c->messengers()->count()),
            'total_social_medias' => $talents->sum(fn($t) => $t->socialMedias()->count()),
        ];
    }
}
