<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Weblink;
use App\Models\Contact;
use App\Models\User;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;

class WeblinkTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test mutator works when saving to database
     */
    public function test_info_mutator_works_when_saving_to_database()
    {
        // Create necessary dependencies
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $contact = Contact::factory()->create([
            'team_id' => $team->id,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        $weblink = Weblink::create([
            'info' => 'example.com/api',
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => Contact::class,
        ]);

        $this->assertEquals('https://example.com/api', $weblink->info);

        // Verify it's stored correctly in database
        $this->assertDatabaseHas('weblinks', [
            'id' => $weblink->id,
            'info' => 'https://example.com/api',
        ]);
    }

    /**
     * Test mutator works when updating existing weblink
     */
    public function test_info_mutator_works_when_updating()
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $contact = Contact::factory()->create([
            'team_id' => $team->id,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        $weblink = Weblink::create([
            'info' => 'https://original.com',
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => Contact::class,
        ]);

        // Update with unsanitized URL
        $weblink->update(['info' => 'updated-site.com']);

        $this->assertEquals('https://updated-site.com', $weblink->fresh()->info);

        // Verify it's updated correctly in database
        $this->assertDatabaseHas('weblinks', [
            'id' => $weblink->id,
            'info' => 'https://updated-site.com',
        ]);
    }

    /**
     * Test weblink can be created with morphTo relationship
     */
    public function test_weblink_morphto_relationship()
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $contact = Contact::factory()->create([
            'team_id' => $team->id,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        $weblink = Weblink::create([
            'info' => 'company-website.com',
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => Contact::class,
        ]);

        // Test relationship
        $this->assertInstanceOf(Contact::class, $weblink->weblinkable);
        $this->assertEquals($contact->id, $weblink->weblinkable->id);

        // Test URL was sanitized
        $this->assertEquals('https://company-website.com', $weblink->info);
    }

    /**
     * Test weblink creation through relationship
     */
    public function test_weblink_creation_through_relationship()
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $contact = Contact::factory()->create([
            'team_id' => $team->id,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        // Create weblink through relationship
        $weblink = $contact->weblinks()->create([
            'info' => 'github.com/user/project',
        ]);

        $this->assertEquals('https://github.com/user/project', $weblink->info);
        $this->assertEquals($contact->id, $weblink->weblinkable_id);
        $this->assertEquals('contact', $weblink->weblinkable_type);
    }

    /**
     * Test mutator works with factory
     */
    public function test_info_mutator_works_with_factory()
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $contact = Contact::factory()->create([
            'team_id' => $team->id,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        // Create a weblink using factory with custom info
        $weblink = Weblink::factory()->create([
            'info' => 'github.com/user/repo',
            'weblinkable_id' => $contact->id,
            'weblinkable_type' => Contact::class,
        ]);

        $this->assertEquals('https://github.com/user/repo', $weblink->info);

        // Verify it's stored correctly in database
        $this->assertDatabaseHas('weblinks', [
            'id' => $weblink->id,
            'info' => 'https://github.com/user/repo',
        ]);
    }

    /**
     * Test mutator works with bulk operations
     */
    public function test_info_mutator_works_with_bulk_operations()
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);
        $contact = Contact::factory()->create([
            'team_id' => $team->id,
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        // Insert multiple weblinks through the contact relationship
        $weblinks = collect([
            ['info' => 'example.com'],
            ['info' => 'github.com/user'],
            ['info' => 'api.service.com:8080'],
        ])->map(function ($data) use ($contact) {
            return $contact->weblinks()->create($data);
        });

        // Verify all URLs were sanitized
        $this->assertEquals('https://example.com', $weblinks[0]->info);
        $this->assertEquals('https://github.com/user', $weblinks[1]->info);
        $this->assertEquals('https://api.service.com:8080', $weblinks[2]->info);

        // Verify count in database
        $this->assertEquals(3, $contact->weblinks()->count());
    }
}
