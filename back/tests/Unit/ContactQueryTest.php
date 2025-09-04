<?php

namespace Tests\Unit;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Team;
use App\Models\User;
use App\Queries\ContactQuery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactQueryTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_query_aggregates_companies_sorted_by_name()
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);

        $contact = Contact::factory()->create([
            'team_id' => $team->id,
            'created_by' => $user->id,
            'updated_by' => $user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'job_title' => 'Dev',
        ]);

        // Create companies with deliberate naming order (B then A) to test sorting
        $companyB = Company::factory()->create(['team_id' => $team->id, 'name' => 'Beta Ltd']);
        $companyA = Company::factory()->create(['team_id' => $team->id, 'name' => 'Alpha Inc']);

        // attach pivot job_title
        $contact->companies()->attach($companyB->id, ['job_title' => 'Engineer']);
        $contact->companies()->attach($companyA->id, ['job_title' => 'Lead']);

        $results = (new ContactQuery($user))->get();

        $this->assertCount(1, $results);
        $result = $results->first();
        $this->assertEquals($contact->id, $result->id);
        $this->assertEquals('John', $result->first_name);
        $this->assertEquals('Doe', $result->last_name);
        // Companies should be sorted by name ascending: Alpha then Beta
        $this->assertEquals('Alpha Inc', $result->companies[0]['name']);
        $this->assertEquals('Lead', $result->companies[0]['job_title']);
        $this->assertEquals('Beta Ltd', $result->companies[1]['name']);
        $this->assertEquals('Engineer', $result->companies[1]['job_title']);
    }

    public function test_contact_query_returns_empty_collection_when_no_contacts()
    {
        $team = Team::factory()->create();
        $user = User::factory()->create(['team_id' => $team->id]);

        $results = (new ContactQuery($user))->get();
        $this->assertTrue($results->isEmpty());
    }
}
