<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_login()
    {
        // Create a test user
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        // Assert response
        $response->assertStatus(204);            

        // Assert user is authenticated
        $this->assertAuthenticated();
    }

    public function test_failed_login_with_invalid_credentials()
    {
        // Create a test user
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        // Attempt to login with wrong password
        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword'
        ]);

        // Assert response
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        // Assert user is not authenticated
        $this->assertGuest();
    }

    public function test_failed_login_with_invalid_email()
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'not-an-email',
            'password' => 'password123'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_failed_login_with_missing_fields()
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com'
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_successful_logout()
    {
        // Create and login a test user
        $user = User::factory()->create();
        $this->actingAs($user);

        // Attempt to logout
        $response = $this->postJson('/api/v1/logout');

        // Assert response
        $response->assertStatus(204);

        // Assert user is logged out
        $this->assertGuest();
    }

    public function test_logout_when_not_logged_in()
    {        
        // Attempt to logout without being logged in
        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'X-CSRF-TOKEN' => 'test-token'
        ])
        ->postJson('/api/v1/logout');

        // Assert response
        $response->assertStatus(204);

        // Assert still not authenticated
        $this->assertGuest();
    }

    public function test_check_auth_when_user_is_authenticated()
    {
        // Create and login a test user
        $user = User::factory()->create();
        $this->actingAs($user);

        // Check login status
        $response = $this->getJson(route('auth.check'));

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'is_authenticated' => true, 
                'user' => $user->toArray()
            ]);
    }

    public function test_check_auth_when_user_is_not_authenticated()
    {
        // Check login status without being logged in
        $response = $this->getJson(route('auth.check'));

        // Assert response
        $response->assertStatus(200)
            ->assertJson([
                'is_authenticated' => false, 
                'user' => null,
            ]);
    }
} 