<?php

namespace Tests\Unit;

use Illuminate\Http\Request;
use Tests\TestCase;

use App\Http\Resources\UserBasicResource;
use App\Models\User;

class UserBasicResourceTest extends TestCase
{
    public function test_basic_returns_correct_user_data_structure()
    {
        // Create a mock user with the required properties
        $user = new class {
            public $id = 123;
            public $name = 'John Doe';
        };

        $resource = UserBasicResource::make($user);
        $result = $resource->toArray(new Request());

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

        $resource = UserBasicResource::make($user);
        $result = $resource->toArray(new Request());

        $this->assertEquals([
            'id' => 456,
            'name' => 'Jane Smith'
        ], $result);
    }
}
