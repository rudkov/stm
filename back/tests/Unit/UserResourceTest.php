<?php

namespace Tests\Unit;

use App\Http\Resources\UserResource;
use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserResourceTest extends TestCase
{
    public function test_basic_returns_correct_user_data_structure()
    {
        // Create a mock user with the required properties
        $user = new class {
            public $id = 123;
            public $name = 'John Doe';
        };

        $result = UserResource::basic($user);

        $this->assertEquals([
            'id' => 123,
            'name' => 'John Doe'
        ], $result);
    }

    public function test_basic_works_with_actual_user_model()
    {
        // Create a user instance (without persisting to database)
        $user = new User();
        $user->id = 456;
        $user->name = 'Jane Smith';

        $result = UserResource::basic($user);

        $this->assertEquals([
            'id' => 456,
            'name' => 'Jane Smith'
        ], $result);
    }
}
