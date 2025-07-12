<?php

namespace Tests\Unit;

use Illuminate\Http\Request;
use Tests\TestCase;

use App\Http\Resources\ContactBasicResource;
use App\Models\Contact;

class ContactBasicResourceTest extends TestCase
{
    public function test_basic_returns_correct_contact_data_structure()
    {
        // Create a mock contact with the required properties
        $contact = new class {
            public $id = 123;
            public $first_name = 'John';
            public $last_name = 'Doe';
            public $pivot;

            public function __construct()
            {
                $this->pivot = new class {
                    public $job_title = 'Senior Developer';
                };
            }
        };

        $resource = ContactBasicResource::make($contact);
        $result = $resource->toArray(new Request());

        $this->assertEquals([
            'id' => 123,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'job_title' => 'Senior Developer'
        ], $result);
    }

    public function test_basic_works_with_actual_contact_model()
    {
        // Create a contact instance (without persisting to database)
        $contact = new Contact();
        $contact->id = 456;
        $contact->first_name = 'Jane';
        $contact->last_name = 'Smith';

        // Mock the pivot relationship
        $contact->pivot = new class {
            public $job_title = 'Project Manager';
        };

        $resource = ContactBasicResource::make($contact);
        $result = $resource->toArray(new Request());

        $this->assertEquals([
            'id' => 456,
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'job_title' => 'Project Manager'
        ], $result);
    }

    public function test_basic_handles_null_job_title()
    {
        // Create a contact with null job title
        $contact = new Contact();
        $contact->id = 789;
        $contact->first_name = 'Bob';
        $contact->last_name = 'Wilson';

        // Mock the pivot relationship with null job_title
        $contact->pivot = new class {
            public $job_title = null;
        };

        $resource = ContactBasicResource::make($contact);
        $result = $resource->toArray(new Request());

        $this->assertEquals([
            'id' => 789,
            'first_name' => 'Bob',
            'last_name' => 'Wilson',
            'job_title' => null
        ], $result);
    }

    public function test_basic_includes_only_expected_fields()
    {
        // Create a contact with additional fields that should not be included
        $contact = new Contact();
        $contact->id = 999;
        $contact->first_name = 'Alice';
        $contact->last_name = 'Johnson';
        $contact->notes = 'This should not be included';
        $contact->created_at = '2023-01-01 00:00:00';
        $contact->updated_at = '2023-01-02 00:00:00';

        $contact->pivot = new class {
            public $job_title = 'Designer';
        };

        $resource = ContactBasicResource::make($contact);
        $result = $resource->toArray(new Request());

        // Verify only the expected fields are present
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('first_name', $result);
        $this->assertArrayHasKey('last_name', $result);
        $this->assertArrayHasKey('job_title', $result);

        // Verify unwanted fields are not present
        $this->assertArrayNotHasKey('notes', $result);
        $this->assertArrayNotHasKey('created_at', $result);
        $this->assertArrayNotHasKey('updated_at', $result);

        // Verify correct values
        $this->assertEquals(999, $result['id']);
        $this->assertEquals('Alice', $result['first_name']);
        $this->assertEquals('Johnson', $result['last_name']);
        $this->assertEquals('Designer', $result['job_title']);
    }
}
