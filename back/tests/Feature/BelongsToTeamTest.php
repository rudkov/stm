<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;

use Tests\TestCase;

use App\Models\CommunicationType;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Talent;
use App\Models\TalentBoard;
use App\Models\Team;
use App\Models\User;

class BelongsToTeamTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team;

    protected function setUp(): void
    {
        parent::setUp();
        $this->team = Team::factory()->create(['name' => 'Test Team']);
    }

    public function test_user_belongs_to_team()
    {
        $user = User::factory()->create(['team_id' => $this->team->id]);

        $this->assertInstanceOf(Team::class, $user->team);
        $this->assertEquals($this->team->id, $user->team->id);
        $this->assertEquals('Test Team', $user->team->name);
    }

    public function test_company_belongs_to_team()
    {
        // Create manually to avoid factory dependencies
        $company = new Company();
        $company->name = 'Test Company';
        $company->team_id = $this->team->id;
        $company->save();

        $this->assertInstanceOf(Team::class, $company->team);
        $this->assertEquals($this->team->id, $company->team->id);
        $this->assertEquals('Test Team', $company->team->name);
    }

    public function test_contact_belongs_to_team()
    {
        // Create manually to avoid factory dependencies
        $contact = new Contact();
        $contact->first_name = 'John';
        $contact->last_name = 'Doe';
        $contact->team_id = $this->team->id;
        $contact->save();

        $this->assertInstanceOf(Team::class, $contact->team);
        $this->assertEquals($this->team->id, $contact->team->id);
        $this->assertEquals('Test Team', $contact->team->name);
    }

    public function test_talent_belongs_to_team()
    {
        // Create manually to avoid factory dependencies
        $talent = new Talent();
        $talent->first_name = 'Jane';
        $talent->last_name = 'Smith';
        $talent->team_id = $this->team->id;
        $talent->save();

        $this->assertInstanceOf(Team::class, $talent->team);
        $this->assertEquals($this->team->id, $talent->team->id);
        $this->assertEquals('Test Team', $talent->team->name);
    }

    public function test_communication_type_belongs_to_team()
    {
        // Create manually to avoid factory dependencies
        $communicationType = new CommunicationType();
        $communicationType->name = 'Email';
        $communicationType->type = 'email';
        $communicationType->weight = 1;
        $communicationType->team_id = $this->team->id;
        $communicationType->save();

        $this->assertInstanceOf(Team::class, $communicationType->team);
        $this->assertEquals($this->team->id, $communicationType->team->id);
        $this->assertEquals('Test Team', $communicationType->team->name);
    }

    public function test_talent_board_belongs_to_team()
    {
        // Create manually to avoid factory dependencies
        $talentBoard = new TalentBoard();
        $talentBoard->name = 'Test Board';
        $talentBoard->team_id = $this->team->id;
        $talentBoard->save();

        $this->assertInstanceOf(Team::class, $talentBoard->team);
        $this->assertEquals($this->team->id, $talentBoard->team->id);
        $this->assertEquals('Test Team', $talentBoard->team->name);
    }

    public function test_belongs_to_team_relationship_returns_null_when_no_team_assigned()
    {
        $user = User::factory()->create(['team_id' => null]);

        $this->assertNull($user->team);
    }

    public function test_belongs_to_team_relationship_eager_loading()
    {
        // Create users manually to avoid factory dependencies
        for ($i = 0; $i < 3; $i++) {
            $user = new User();
            $user->name = "User {$i}";
            $user->email = "user{$i}@example.com";
            $user->password = 'password';
            $user->team_id = $this->team->id;
            $user->save();
        }

        $loadedUsers = User::with('team')->get();

        foreach ($loadedUsers as $user) {
            $this->assertTrue($user->relationLoaded('team'));
            $this->assertEquals($this->team->id, $user->team->id);
        }
    }

    public function test_belongs_to_team_relationship_query_constraints()
    {
        $anotherTeam = Team::factory()->create(['name' => 'Another Team']);

        // Create users for both teams manually
        $user1 = new User();
        $user1->name = 'Team 1 User 1';
        $user1->email = 'team1user1@example.com';
        $user1->password = 'password';
        $user1->team_id = $this->team->id;
        $user1->save();

        $user2 = new User();
        $user2->name = 'Team 1 User 2';
        $user2->email = 'team1user2@example.com';
        $user2->password = 'password';
        $user2->team_id = $this->team->id;
        $user2->save();

        $user3 = new User();
        $user3->name = 'Team 2 User 1';
        $user3->email = 'team2user1@example.com';
        $user3->password = 'password';
        $user3->team_id = $anotherTeam->id;
        $user3->save();

        $teamUsers = User::whereHas('team', function ($query) {
            $query->where('name', 'Test Team');
        })->get();

        $this->assertCount(2, $teamUsers);
        foreach ($teamUsers as $user) {
            $this->assertEquals($this->team->id, $user->team_id);
        }
    }
}
