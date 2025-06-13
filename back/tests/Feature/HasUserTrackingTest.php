<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Team;
use App\Traits\HasUserTracking;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

// Test model that uses the HasUserTracking trait
class TestModelWithUserTracking extends Model
{
    use HasUserTracking;

    protected $table = 'test_models_with_user_tracking';
    protected $fillable = ['name'];
    public $userTracking = true; // Default behavior
}

// Test model that disables user tracking by default
class TestModelWithUserTrackingDisabled extends Model
{
    use HasUserTracking;

    protected $table = 'test_models_with_user_tracking';
    protected $fillable = ['name'];
    public $userTracking = false;
}

class HasUserTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected Team $team;
    protected User|Authenticatable $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test table
        Schema::create('test_models_with_user_tracking', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
            $table->timestamps();
        });

        // Create team and user
        $this->team = Team::factory()->create();
        $this->user = User::factory()->create(['team_id' => $this->team->id]);
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('test_models_with_user_tracking');
        parent::tearDown();
    }

    public function test_automatically_sets_created_by_and_updated_by_when_creating_model()
    {
        $this->actingAs($this->user);

        $model = TestModelWithUserTracking::create(['name' => 'Test Model']);

        $this->assertEquals($this->user->id, $model->created_by);
        $this->assertEquals($this->user->id, $model->updated_by);
        $this->assertDatabaseHas('test_models_with_user_tracking', [
            'id' => $model->id,
            'created_by' => $this->user->id,
            'updated_by' => $this->user->id,
        ]);
    }

    public function test_automatically_sets_updated_by_when_updating_model()
    {
        $this->actingAs($this->user);

        // Create model
        $model = TestModelWithUserTracking::create(['name' => 'Original Name']);

        // Create another user to update with
        /** @var User|Authenticatable $otherUser */
        $otherUser = User::factory()->create(['team_id' => $this->team->id]);
        $this->actingAs($otherUser);

        // Update model
        $model->update(['name' => 'Updated Name']);

        $this->assertEquals($this->user->id, $model->created_by); // Should remain the same
        $this->assertEquals($otherUser->id, $model->updated_by); // Should be the new user
        $this->assertDatabaseHas('test_models_with_user_tracking', [
            'id' => $model->id,
            'created_by' => $this->user->id,
            'updated_by' => $otherUser->id,
        ]);
    }

    public function test_does_not_set_user_tracking_when_user_not_authenticated()
    {
        // No authenticated user
        Auth::logout();

        $model = TestModelWithUserTracking::create(['name' => 'Test Model']);

        $this->assertNull($model->created_by);
        $this->assertNull($model->updated_by);
        $this->assertDatabaseHas('test_models_with_user_tracking', [
            'id' => $model->id,
            'created_by' => null,
            'updated_by' => null,
        ]);
    }

    public function test_does_not_override_manually_set_created_by_and_updated_by()
    {
        $this->actingAs($this->user);

        // Create another user to manually assign
        $manualUser = User::factory()->create(['team_id' => $this->team->id]);

        $model = new TestModelWithUserTracking(['name' => 'Test Model']);
        $model->created_by = $manualUser->id;
        $model->updated_by = $manualUser->id;
        $model->save();

        // Should keep the manually set values, not override with current user
        $this->assertEquals($manualUser->id, $model->created_by);
        $this->assertEquals($manualUser->id, $model->updated_by);
        $this->assertDatabaseHas('test_models_with_user_tracking', [
            'id' => $model->id,
            'created_by' => $manualUser->id,
            'updated_by' => $manualUser->id,
        ]);
    }

    public function test_respects_user_tracking_disabled_at_class_level()
    {
        $this->actingAs($this->user);

        $model = TestModelWithUserTrackingDisabled::create(['name' => 'Test Model']);

        $this->assertNull($model->created_by);
        $this->assertNull($model->updated_by);
        $this->assertDatabaseHas('test_models_with_user_tracking', [
            'id' => $model->id,
            'created_by' => null,
            'updated_by' => null,
        ]);
    }

    public function test_respects_user_tracking_disabled_at_instance_level()
    {
        $this->actingAs($this->user);

        $model = new TestModelWithUserTracking(['name' => 'Test Model']);
        $model->userTracking = false;
        $model->save();

        $this->assertNull($model->created_by);
        $this->assertNull($model->updated_by);
        $this->assertDatabaseHas('test_models_with_user_tracking', [
            'id' => $model->id,
            'created_by' => null,
            'updated_by' => null,
        ]);
    }

    public function test_set_user_tracking_method_works_fluently()
    {
        $this->actingAs($this->user);

        $model = new TestModelWithUserTracking(['name' => 'Test Model']);

        // Test fluent interface
        $result = $model->setUserTracking(false);
        $this->assertSame($model, $result); // Should return the same instance

        $model->save();

        $this->assertNull($model->created_by);
        $this->assertNull($model->updated_by);
    }

    public function test_can_re_enable_user_tracking_after_disabling()
    {
        $this->actingAs($this->user);

        $model = new TestModelWithUserTracking(['name' => 'Test Model']);
        $model->userTracking = false;
        $model->save();

        // Verify it was disabled
        $this->assertNull($model->created_by);
        $this->assertNull($model->updated_by);

        // Re-enable and update
        $model->userTracking = true;
        $model->update(['name' => 'Updated Name']);

        // Now it should set updated_by
        $this->assertEquals($this->user->id, $model->updated_by);
    }

    public function test_uses_user_tracking_method_returns_correct_values()
    {
        $model = new TestModelWithUserTracking();
        $this->assertTrue($model->usesUserTracking()); // Default should be true

        $model->userTracking = false;
        $this->assertFalse($model->usesUserTracking());

        $model->userTracking = true;
        $this->assertTrue($model->usesUserTracking());

        // Test class-level disabled model
        $disabledModel = new TestModelWithUserTrackingDisabled();
        $this->assertFalse($disabledModel->usesUserTracking());
    }

    public function test_created_by_relationship_returns_correct_user()
    {
        $this->actingAs($this->user);

        $model = TestModelWithUserTracking::create(['name' => 'Test Model']);

        $createdByUser = $model->createdBy;

        $this->assertInstanceOf(User::class, $createdByUser);
        $this->assertEquals($this->user->id, $createdByUser->id);
        $this->assertEquals($this->user->name, $createdByUser->name);
    }

    public function test_updated_by_relationship_returns_correct_user()
    {
        $this->actingAs($this->user);

        $model = TestModelWithUserTracking::create(['name' => 'Test Model']);

        // Create another user to update with
        /** @var User|Authenticatable $otherUser */
        $otherUser = User::factory()->create(['team_id' => $this->team->id]);
        $this->actingAs($otherUser);

        $model->update(['name' => 'Updated Name']);

        $updatedByUser = $model->updatedBy;

        $this->assertInstanceOf(User::class, $updatedByUser);
        $this->assertEquals($otherUser->id, $updatedByUser->id);
        $this->assertEquals($otherUser->name, $updatedByUser->name);
    }

    public function test_relationships_return_null_when_no_user_set()
    {
        // No authenticated user
        Auth::logout();

        $model = TestModelWithUserTracking::create(['name' => 'Test Model']);

        $this->assertNull($model->createdBy);
        $this->assertNull($model->updatedBy);
    }

    public function test_does_not_update_created_by_on_subsequent_saves()
    {
        $this->actingAs($this->user);

        $model = TestModelWithUserTracking::create(['name' => 'Test Model']);
        $originalCreatedBy = $model->created_by;

        // Create another user and switch to them
        /** @var User|Authenticatable $otherUser */
        $otherUser = User::factory()->create(['team_id' => $this->team->id]);
        $this->actingAs($otherUser);

        // Update the model
        $model->update(['name' => 'Updated Name']);

        // created_by should remain the same, only updated_by should change
        $this->assertEquals($originalCreatedBy, $model->created_by);
        $this->assertEquals($otherUser->id, $model->updated_by);
    }

    public function test_trait_works_with_model_using_save_method()
    {
        $this->actingAs($this->user);

        $model = new TestModelWithUserTracking();
        $model->name = 'Test Model';
        $model->save();

        $this->assertEquals($this->user->id, $model->created_by);
        $this->assertEquals($this->user->id, $model->updated_by);
    }

    public function test_trait_works_with_model_using_create_method()
    {
        $this->actingAs($this->user);

        $model = TestModelWithUserTracking::create(['name' => 'Test Model']);

        $this->assertEquals($this->user->id, $model->created_by);
        $this->assertEquals($this->user->id, $model->updated_by);
    }

    public function test_instance_level_userTracking_overrides_class_level_setting()
    {
        $this->actingAs($this->user);

        // Start with class that has userTracking = false
        $model = new TestModelWithUserTrackingDisabled(['name' => 'Test Model']);

        // Override at instance level
        $model->userTracking = true;
        $model->save();

        // Should now track users because instance level overrides class level
        $this->assertEquals($this->user->id, $model->created_by);
        $this->assertEquals($this->user->id, $model->updated_by);
    }

    public function test_user_tracking_property_is_not_saved_to_database()
    {
        $this->actingAs($this->user);

        $model = TestModelWithUserTracking::create(['name' => 'Test Model']);

        // Set userTracking property
        $model->userTracking = false;
        $model->name = 'Updated Name';
        $model->save();

        // Verify userTracking is not in the database
        $this->assertDatabaseMissing('test_models_with_user_tracking', [
            'id' => $model->id,
            'userTracking' => false,
        ]);

        // But the name should be updated
        $this->assertDatabaseHas('test_models_with_user_tracking', [
            'id' => $model->id,
            'name' => 'Updated Name',
        ]);

        // Verify the property still works for trait logic
        $this->assertFalse($model->usesUserTracking());
    }
}
