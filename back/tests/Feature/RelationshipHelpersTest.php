<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;

use Tests\TestCase;

use App\Models\CommunicationType;
use App\Models\Email;
use App\Models\Talent;
use App\Models\TalentRelative;
use App\Models\TalentRelativeType;
use App\Models\Team;
use App\Models\User;

use function App\Helpers\sync_has_many;
use function App\Helpers\sync_morph_many;

class RelationshipHelpersTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team;
    protected User $user;
    protected Talent $talent;

    protected function setUp(): void
    {
        parent::setUp();

        // Clear factory cache to avoid stale data in tests
        \Database\Factories\TalentFactory::clearCache();

        // Create team and user
        $this->team = Team::factory()->create();
        $this->user = User::factory()->create(['team_id' => $this->team->id]);

        // Create talent for testing - use minimal data to avoid foreign key constraints
        $this->talent = new \App\Models\Talent([
            'first_name' => 'Test',
            'last_name' => 'Talent',
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);
        $this->talent->save();
    }

    // ==================== sync_has_many Tests ====================

    public function test_sync_has_many_creates_new_records()
    {
        // Create a relative type for testing
        $relativeType = TalentRelativeType::factory()->create();

        $items = [
            [
                'relative_type_id' => $relativeType->id,
                'info' => 'John Doe - Father'
            ],
            [
                'relative_type_id' => $relativeType->id,
                'info' => 'Jane Doe - Mother'
            ]
        ];

        sync_has_many($this->talent->relatives(), $items, ['relative_type_id', 'info']);

        // Assert records were created
        $this->assertDatabaseHas('talent_relatives', [
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'John Doe - Father'
        ]);

        $this->assertDatabaseHas('talent_relatives', [
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'Jane Doe - Mother'
        ]);

        $this->assertEquals(2, $this->talent->relatives()->count());
    }

    public function test_sync_has_many_updates_existing_records()
    {
        $relativeType = TalentRelativeType::factory()->create();

        // Create existing relative
        $existingRelative = TalentRelative::factory()->create([
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'Original Info'
        ]);

        $items = [
            [
                'id' => $existingRelative->id,
                'relative_type_id' => $relativeType->id,
                'info' => 'Updated Info'
            ]
        ];

        sync_has_many($this->talent->relatives(), $items, ['relative_type_id', 'info']);

        // Assert record was updated
        $this->assertDatabaseHas('talent_relatives', [
            'id' => $existingRelative->id,
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'Updated Info'
        ]);

        $this->assertEquals(1, $this->talent->relatives()->count());
    }

    public function test_sync_has_many_deletes_removed_records()
    {
        $relativeType = TalentRelativeType::factory()->create();

        // Create existing relatives
        $relative1 = TalentRelative::factory()->create([
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'Keep This'
        ]);

        $relative2 = TalentRelative::factory()->create([
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'Delete This'
        ]);

        // Only keep the first relative
        $items = [
            [
                'id' => $relative1->id,
                'relative_type_id' => $relativeType->id,
                'info' => 'Keep This'
            ]
        ];

        sync_has_many($this->talent->relatives(), $items, ['relative_type_id', 'info']);

        // Assert first relative still exists
        $this->assertDatabaseHas('talent_relatives', [
            'id' => $relative1->id,
            'talent_id' => $this->talent->id
        ]);

        // Assert second relative was deleted
        $this->assertDatabaseMissing('talent_relatives', [
            'id' => $relative2->id
        ]);

        $this->assertEquals(1, $this->talent->relatives()->count());
    }

    public function test_sync_has_many_handles_empty_input()
    {
        $relativeType = TalentRelativeType::factory()->create();

        // Create existing relative
        TalentRelative::factory()->create([
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'Should be deleted'
        ]);

        // Sync with empty array
        sync_has_many($this->talent->relatives(), [], ['relative_type_id', 'info']);

        // Assert all relatives were deleted
        $this->assertEquals(0, $this->talent->relatives()->count());
    }

    public function test_sync_has_many_mixed_create_update_delete()
    {
        $relativeType = TalentRelativeType::factory()->create();

        // Create existing relatives
        $existingRelative = TalentRelative::factory()->create([
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'To Update'
        ]);

        $toDeleteRelative = TalentRelative::factory()->create([
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'To Delete'
        ]);

        $items = [
            // Update existing
            [
                'id' => $existingRelative->id,
                'relative_type_id' => $relativeType->id,
                'info' => 'Updated Info'
            ],
            // Create new
            [
                'relative_type_id' => $relativeType->id,
                'info' => 'New Relative'
            ]
            // Note: toDeleteRelative is not included, so it should be deleted
        ];

        sync_has_many($this->talent->relatives(), $items, ['relative_type_id', 'info']);

        // Assert update
        $this->assertDatabaseHas('talent_relatives', [
            'id' => $existingRelative->id,
            'info' => 'Updated Info'
        ]);

        // Assert creation
        $this->assertDatabaseHas('talent_relatives', [
            'talent_id' => $this->talent->id,
            'info' => 'New Relative'
        ]);

        // Assert deletion
        $this->assertDatabaseMissing('talent_relatives', [
            'id' => $toDeleteRelative->id
        ]);

        $this->assertEquals(2, $this->talent->relatives()->count());
    }

    public function test_sync_has_many_respects_fillable_fields()
    {
        $relativeType = TalentRelativeType::factory()->create();

        $items = [
            [
                'relative_type_id' => $relativeType->id,
                'info' => 'Test Info',
                'non_fillable_field' => 'Should be ignored'
            ]
        ];

        sync_has_many($this->talent->relatives(), $items, ['relative_type_id', 'info']);

        // Assert only fillable fields were saved
        $this->assertDatabaseHas('talent_relatives', [
            'talent_id' => $this->talent->id,
            'relative_type_id' => $relativeType->id,
            'info' => 'Test Info'
        ]);

        // The non_fillable_field shouldn't cause issues (Laravel will ignore it)
        $this->assertEquals(1, $this->talent->relatives()->count());
    }

    // ==================== sync_morph_many Tests ====================

    public function test_sync_morph_many_creates_new_records_with_direct_fields()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        $items = [
            [
                'communication_type_id' => $communicationType->id,
                'info' => 'test@example.com'
            ],
            [
                'communication_type_id' => $communicationType->id,
                'info' => 'admin@example.com'
            ]
        ];

        sync_morph_many($this->talent->emails(), $items, ['communication_type_id', 'info']);

        // Assert records were created
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'test@example.com'
        ]);

        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'admin@example.com'
        ]);

        $this->assertEquals(2, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_creates_new_records_with_field_mapping()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        $items = [
            [
                'type' => ['id' => $communicationType->id],
                'info' => 'mapped@example.com'
            ]
        ];

        sync_morph_many($this->talent->emails(), $items, ['communication_type_id' => 'type.id', 'info']);

        // Assert record was created with mapped field
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'mapped@example.com'
        ]);

        $this->assertEquals(1, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_updates_existing_records()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        // Create existing email
        $existingEmail = Email::factory()->create([
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'original@example.com'
        ]);

        $items = [
            [
                'id' => $existingEmail->id,
                'communication_type_id' => $communicationType->id,
                'info' => 'updated@example.com'
            ]
        ];

        sync_morph_many($this->talent->emails(), $items, ['communication_type_id', 'info']);

        // Assert record was updated
        $this->assertDatabaseHas('emails', [
            'id' => $existingEmail->id,
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'updated@example.com'
        ]);

        $this->assertEquals(1, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_deletes_removed_records()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        // Create existing emails
        $email1 = Email::factory()->create([
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'keep@example.com'
        ]);

        $email2 = Email::factory()->create([
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'delete@example.com'
        ]);

        // Only keep the first email
        $items = [
            [
                'id' => $email1->id,
                'communication_type_id' => $communicationType->id,
                'info' => 'keep@example.com'
            ]
        ];

        sync_morph_many($this->talent->emails(), $items, ['communication_type_id', 'info']);

        // Assert first email still exists
        $this->assertDatabaseHas('emails', [
            'id' => $email1->id,
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent'
        ]);

        // Assert second email was deleted
        $this->assertDatabaseMissing('emails', [
            'id' => $email2->id
        ]);

        $this->assertEquals(1, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_handles_empty_input()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        // Create existing email
        Email::factory()->create([
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'delete@example.com'
        ]);

        // Sync with empty array
        sync_morph_many($this->talent->emails(), [], ['communication_type_id', 'info']);

        // Assert all emails were deleted
        $this->assertEquals(0, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_mixed_create_update_delete()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        // Create existing emails
        $existingEmail = Email::factory()->create([
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'update@example.com'
        ]);

        $toDeleteEmail = Email::factory()->create([
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'delete@example.com'
        ]);

        $items = [
            // Update existing
            [
                'id' => $existingEmail->id,
                'communication_type_id' => $communicationType->id,
                'info' => 'updated@example.com'
            ],
            // Create new
            [
                'communication_type_id' => $communicationType->id,
                'info' => 'new@example.com'
            ]
            // Note: toDeleteEmail is not included, so it should be deleted
        ];

        sync_morph_many($this->talent->emails(), $items, ['communication_type_id', 'info']);

        // Assert update
        $this->assertDatabaseHas('emails', [
            'id' => $existingEmail->id,
            'info' => 'updated@example.com'
        ]);

        // Assert creation
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'info' => 'new@example.com'
        ]);

        // Assert deletion
        $this->assertDatabaseMissing('emails', [
            'id' => $toDeleteEmail->id
        ]);

        $this->assertEquals(2, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_handles_complex_field_mapping()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        $items = [
            [
                'type' => ['id' => $communicationType->id],
                'contact_info' => 'complex@example.com',
                'metadata' => ['priority' => 'high']
            ]
        ];

        sync_morph_many($this->talent->emails(), $items, [
            'communication_type_id' => 'type.id',
            'info' => 'contact_info'
        ]);

        // Assert record was created with complex mapping
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'complex@example.com'
        ]);

        $this->assertEquals(1, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_handles_mixed_field_formats()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        $items = [
            [
                'type' => ['id' => $communicationType->id],
                'info' => 'mixed@example.com'
            ]
        ];

        // Mix of direct fields and mapped fields
        sync_morph_many($this->talent->emails(), $items, [
            'communication_type_id' => 'type.id', // Mapped field
            'info' // Direct field
        ]);

        // Assert record was created
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'mixed@example.com'
        ]);

        $this->assertEquals(1, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_ignores_missing_nested_paths()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        $items = [
            [
                // Missing 'type.id' path, should be ignored
                'info' => 'partial@example.com'
            ]
        ];

        sync_morph_many($this->talent->emails(), $items, [
            'communication_type_id' => 'type.id', // This path doesn't exist in item
            'info'
        ]);

        // Should create record with only the available fields
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => null, // Should be null since path doesn't exist
            'info' => 'partial@example.com'
        ]);

        $this->assertEquals(1, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_handles_null_values_in_nested_paths()
    {
        $items = [
            [
                'type' => ['id' => null], // Explicit null value
                'info' => 'null@example.com'
            ]
        ];

        sync_morph_many($this->talent->emails(), $items, [
            'communication_type_id' => 'type.id',
            'info'
        ]);

        // Should create record with null value (since path exists but value is null)
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => null,
            'info' => 'null@example.com'
        ]);

        $this->assertEquals(1, $this->talent->emails()->count());
    }

    public function test_sync_morph_many_doesnt_affect_other_models_records()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        // Create another talent with emails
        $otherTalent = new \App\Models\Talent([
            'first_name' => 'Other',
            'last_name' => 'Talent',
            'team_id' => $this->team->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);
        $otherTalent->save();

        $otherEmail = Email::factory()->create([
            'emailable_id' => $otherTalent->id,
            'emailable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => 'other@example.com'
        ]);

        // Sync emails for our main talent (should not affect other talent's emails)
        $items = [
            [
                'communication_type_id' => $communicationType->id,
                'info' => 'main@example.com'
            ]
        ];

        sync_morph_many($this->talent->emails(), $items, ['communication_type_id', 'info']);

        // Assert other talent's email still exists
        $this->assertDatabaseHas('emails', [
            'id' => $otherEmail->id,
            'emailable_id' => $otherTalent->id,
            'emailable_type' => 'talent',
            'info' => 'other@example.com'
        ]);

        // Assert main talent has its email
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'emailable_type' => 'talent',
            'info' => 'main@example.com'
        ]);

        $this->assertEquals(1, $this->talent->emails()->count());
        $this->assertEquals(1, $otherTalent->emails()->count());
    }

    // ==================== Comprehensive Morphable Type Tests ====================

    public function test_sync_morph_many_with_addresses_using_nested_field_mapping()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        $items = [
            [
                'type' => ['id' => $communicationType->id],
                'info' => '123 Main Street, City, Country'
            ],
            [
                'type' => ['id' => $communicationType->id],
                'info' => '456 Oak Avenue, Another City'
            ]
        ];

        sync_morph_many($this->talent->addresses(), $items, ['communication_type_id' => 'type.id', 'info']);

        // Assert records were created with nested field mapping
        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $this->talent->id,
            'addressable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => '123 Main Street, City, Country'
        ]);

        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $this->talent->id,
            'addressable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => '456 Oak Avenue, Another City'
        ]);

        $this->assertEquals(2, $this->talent->addresses()->count());
    }

    public function test_sync_morph_many_with_phones_using_nested_field_mapping()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        $items = [
            [
                'type' => ['id' => $communicationType->id],
                'info' => '+1-555-123-4567'
            ],
            [
                'type' => ['id' => $communicationType->id],
                'info' => '+1-555-987-6543'
            ]
        ];

        sync_morph_many($this->talent->phones(), $items, ['communication_type_id' => 'type.id', 'info']);

        // Assert records were created with nested field mapping
        $this->assertDatabaseHas('phones', [
            'phoneable_id' => $this->talent->id,
            'phoneable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => '+1-555-123-4567'
        ]);

        $this->assertDatabaseHas('phones', [
            'phoneable_id' => $this->talent->id,
            'phoneable_type' => 'talent',
            'communication_type_id' => $communicationType->id,
            'info' => '+1-555-987-6543'
        ]);

        $this->assertEquals(2, $this->talent->phones()->count());
    }

    public function test_sync_morph_many_with_messengers_using_direct_field_mapping()
    {
        $messengerType = \App\Models\MessengerType::factory()->create();

        $items = [
            [
                'messenger_type_id' => $messengerType->id,
                'info' => 'john_doe_messenger'
            ],
            [
                'messenger_type_id' => $messengerType->id,
                'info' => 'jane_doe_messenger'
            ]
        ];

        sync_morph_many($this->talent->messengers(), $items, ['messenger_type_id', 'info']);

        // Assert records were created with direct field mapping
        $this->assertDatabaseHas('messengers', [
            'messengerable_id' => $this->talent->id,
            'messengerable_type' => 'talent',
            'messenger_type_id' => $messengerType->id,
            'info' => 'john_doe_messenger'
        ]);

        $this->assertDatabaseHas('messengers', [
            'messengerable_id' => $this->talent->id,
            'messengerable_type' => 'talent',
            'messenger_type_id' => $messengerType->id,
            'info' => 'jane_doe_messenger'
        ]);

        $this->assertEquals(2, $this->talent->messengers()->count());
    }

    public function test_sync_morph_many_with_social_medias_using_direct_field_mapping()
    {
        $socialMediaType = \App\Models\SocialMediaType::factory()->create();

        $items = [
            [
                'social_media_type_id' => $socialMediaType->id,
                'info' => 'john_doe_social'
            ],
            [
                'social_media_type_id' => $socialMediaType->id,
                'info' => 'jane_doe_social'
            ]
        ];

        sync_morph_many($this->talent->socialMedias(), $items, ['social_media_type_id', 'info']);

        // Assert records were created with direct field mapping
        $this->assertDatabaseHas('social_media', [
            'social_mediaable_id' => $this->talent->id,
            'social_mediaable_type' => 'talent',
            'social_media_type_id' => $socialMediaType->id,
            'info' => 'john_doe_social'
        ]);

        $this->assertDatabaseHas('social_media', [
            'social_mediaable_id' => $this->talent->id,
            'social_mediaable_type' => 'talent',
            'social_media_type_id' => $socialMediaType->id,
            'info' => 'jane_doe_social'
        ]);

        $this->assertEquals(2, $this->talent->socialMedias()->count());
    }

    public function test_sync_morph_many_with_different_field_mapping_patterns()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);
        $messengerType = \App\Models\MessengerType::factory()->create();
        $socialMediaType = \App\Models\SocialMediaType::factory()->create();

        // Test complex field mapping (addresses with nested type.id)
        sync_morph_many($this->talent->addresses(), [
            ['type' => ['id' => $communicationType->id], 'info' => '123 Main St']
        ], ['communication_type_id' => 'type.id', 'info']);

        // Test complex field mapping (phones with nested type.id)
        sync_morph_many($this->talent->phones(), [
            ['type' => ['id' => $communicationType->id], 'info' => '+1-555-0123']
        ], ['communication_type_id' => 'type.id', 'info']);

        // Test direct field mapping (messengers)
        sync_morph_many($this->talent->messengers(), [
            ['messenger_type_id' => $messengerType->id, 'info' => 'username']
        ], ['messenger_type_id', 'info']);

        // Test direct field mapping (social media)
        sync_morph_many($this->talent->socialMedias(), [
            ['social_media_type_id' => $socialMediaType->id, 'info' => 'handle']
        ], ['social_media_type_id', 'info']);

        // Verify all records were created correctly
        $this->assertEquals(1, $this->talent->addresses()->count());
        $this->assertEquals(1, $this->talent->phones()->count());
        $this->assertEquals(1, $this->talent->messengers()->count());
        $this->assertEquals(1, $this->talent->socialMedias()->count());

        // Verify correct data was stored
        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $this->talent->id,
            'communication_type_id' => $communicationType->id,
            'info' => '123 Main St'
        ]);

        $this->assertDatabaseHas('phones', [
            'phoneable_id' => $this->talent->id,
            'communication_type_id' => $communicationType->id,
            'info' => '+1-555-0123'
        ]);

        $this->assertDatabaseHas('messengers', [
            'messengerable_id' => $this->talent->id,
            'messenger_type_id' => $messengerType->id,
            'info' => 'username'
        ]);

        $this->assertDatabaseHas('social_media', [
            'social_mediaable_id' => $this->talent->id,
            'social_media_type_id' => $socialMediaType->id,
            'info' => 'handle'
        ]);
    }

    public function test_sync_morph_many_updates_and_deletes_across_different_morphable_types()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);
        $messengerType = \App\Models\MessengerType::factory()->create();

        // Create existing records for addresses and messengers
        $existingAddress = new \App\Models\Address([
            'communication_type_id' => $communicationType->id,
            'info' => 'Old Address'
        ]);
        $this->talent->addresses()->save($existingAddress);

        $existingMessenger = new \App\Models\Messenger([
            'messenger_type_id' => $messengerType->id,
            'info' => 'old_username'
        ]);
        $this->talent->messengers()->save($existingMessenger);

        $messengerToDelete = new \App\Models\Messenger([
            'messenger_type_id' => $messengerType->id,
            'info' => 'delete_me'
        ]);
        $this->talent->messengers()->save($messengerToDelete);

        // Update address
        sync_morph_many($this->talent->addresses(), [
            [
                'id' => $existingAddress->id,
                'type' => ['id' => $communicationType->id],
                'info' => 'Updated Address'
            ]
        ], ['communication_type_id' => 'type.id', 'info']);

        // Update messenger and delete another
        sync_morph_many($this->talent->messengers(), [
            [
                'id' => $existingMessenger->id,
                'messenger_type_id' => $messengerType->id,
                'info' => 'updated_username'
            ]
            // Note: messengerToDelete is not included, so it should be deleted
        ], ['messenger_type_id', 'info']);

        // Verify updates
        $this->assertDatabaseHas('addresses', [
            'id' => $existingAddress->id,
            'info' => 'Updated Address'
        ]);

        $this->assertDatabaseHas('messengers', [
            'id' => $existingMessenger->id,
            'info' => 'updated_username'
        ]);

        // Verify deletion
        $this->assertDatabaseMissing('messengers', [
            'id' => $messengerToDelete->id
        ]);

        // Verify counts
        $this->assertEquals(1, $this->talent->addresses()->count());
        $this->assertEquals(1, $this->talent->messengers()->count());
    }

    public function test_sync_morph_many_handles_missing_nested_paths_across_morphable_types()
    {
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);

        // Test emails with missing nested path
        sync_morph_many($this->talent->emails(), [
            ['info' => 'email_without_type@example.com']
        ], ['communication_type_id' => 'type.id', 'info']);

        // Test addresses with missing nested path
        sync_morph_many($this->talent->addresses(), [
            ['info' => 'Address without type']
        ], ['communication_type_id' => 'type.id', 'info']);

        // Test phones with missing nested path
        sync_morph_many($this->talent->phones(), [
            ['info' => '+1-555-NO-TYPE']
        ], ['communication_type_id' => 'type.id', 'info']);

        // Verify records were created with null communication_type_id
        $this->assertDatabaseHas('emails', [
            'emailable_id' => $this->talent->id,
            'communication_type_id' => null,
            'info' => 'email_without_type@example.com'
        ]);

        $this->assertDatabaseHas('addresses', [
            'addressable_id' => $this->talent->id,
            'communication_type_id' => null,
            'info' => 'Address without type'
        ]);

        $this->assertDatabaseHas('phones', [
            'phoneable_id' => $this->talent->id,
            'communication_type_id' => null,
            'info' => '+1-555-NO-TYPE'
        ]);

        // Verify counts
        $this->assertEquals(1, $this->talent->emails()->count());
        $this->assertEquals(1, $this->talent->addresses()->count());
        $this->assertEquals(1, $this->talent->phones()->count());
    }

    public function test_sync_morph_many_production_usage_patterns()
    {
        // This test replicates the exact patterns used in TalentController.php
        $communicationType = CommunicationType::factory()->create(['team_id' => $this->team->id]);
        $messengerType = \App\Models\MessengerType::factory()->create();
        $socialMediaType = \App\Models\SocialMediaType::factory()->create();

        // Simulate validated data structure from TalentController
        $validated = [
            'addresses' => [
                ['type' => ['id' => $communicationType->id], 'info' => 'Home Address'],
                ['type' => ['id' => $communicationType->id], 'info' => 'Work Address']
            ],
            'emails' => [
                ['type' => ['id' => $communicationType->id], 'info' => 'personal@example.com'],
                ['type' => ['id' => $communicationType->id], 'info' => 'work@example.com']
            ],
            'messengers' => [
                ['messenger_type_id' => $messengerType->id, 'info' => 'john_messenger'],
                ['messenger_type_id' => $messengerType->id, 'info' => 'john_work_messenger']
            ],
            'phones' => [
                ['type' => ['id' => $communicationType->id], 'info' => '+1-555-HOME'],
                ['type' => ['id' => $communicationType->id], 'info' => '+1-555-WORK']
            ],
            'social_medias' => [
                ['social_media_type_id' => $socialMediaType->id, 'info' => 'john_social'],
                ['social_media_type_id' => $socialMediaType->id, 'info' => 'john_professional']
            ]
        ];

        // Execute exactly as done in TalentController.php
        sync_morph_many($this->talent->addresses(), $validated['addresses'] ?? [], ['communication_type_id' => 'type.id', 'info']);
        sync_morph_many($this->talent->emails(), $validated['emails'] ?? [], ['communication_type_id' => 'type.id', 'info']);
        sync_morph_many($this->talent->messengers(), $validated['messengers'] ?? [], ['messenger_type_id', 'info']);
        sync_morph_many($this->talent->phones(), $validated['phones'] ?? [], ['communication_type_id' => 'type.id', 'info']);
        sync_morph_many($this->talent->socialMedias(), $validated['social_medias'] ?? [], ['social_media_type_id', 'info']);

        // Verify all records were created correctly
        $this->assertEquals(2, $this->talent->addresses()->count());
        $this->assertEquals(2, $this->talent->emails()->count());
        $this->assertEquals(2, $this->talent->messengers()->count());
        $this->assertEquals(2, $this->talent->phones()->count());
        $this->assertEquals(2, $this->talent->socialMedias()->count());

        // Verify specific records exist
        $this->assertDatabaseHas('addresses', ['info' => 'Home Address']);
        $this->assertDatabaseHas('addresses', ['info' => 'Work Address']);
        $this->assertDatabaseHas('emails', ['info' => 'personal@example.com']);
        $this->assertDatabaseHas('emails', ['info' => 'work@example.com']);
        $this->assertDatabaseHas('messengers', ['info' => 'john_messenger']);
        $this->assertDatabaseHas('messengers', ['info' => 'john_work_messenger']);
        $this->assertDatabaseHas('phones', ['info' => '+1-555-HOME']);
        $this->assertDatabaseHas('phones', ['info' => '+1-555-WORK']);
        $this->assertDatabaseHas('social_media', ['info' => 'john_social']);
        $this->assertDatabaseHas('social_media', ['info' => 'john_professional']);
    }
}
