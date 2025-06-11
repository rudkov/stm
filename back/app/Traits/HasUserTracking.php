<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

/**
 * Trait HasUserTracking
 * 
 * Provides automatic tracking of which user created and updated model records.
 * Similar to Laravel's automatic timestamp tracking, but for user relationships.
 * 
 * Usage Examples:
 * 
 * 1. Basic usage (automatic tracking enabled by default):
 *    class Company extends Model {
 *        use HasUserTracking;
 *    }
 * 
 * 2. Disable automatic tracking for entire model:
 *    class Company extends Model {
 *        use HasUserTracking;
 *        public $userTracking = false;
 *    }
 *    // You can always set created_by/updated_by manually if needed
 * 
 * 3. Disable tracking for specific operation:
 *    $company = Company::find(1);
 *    $company->userTracking = false;
 *    $company->save(); // Won't update created_by/updated_by
 * 
 * 4. Alternative method syntax:
 *    $company->setUserTracking(false)->save();
 * 
 * 5. Re-enable tracking:
 *    $company->userTracking = true;
 *    $company->save(); // Will update updated_by
 * 
 * The trait provides:
 * - createdBy() relationship to User model
 * - updatedBy() relationship to User model  
 * - Automatic setting of created_by and updated_by fields during create/update
 * - Ability to disable tracking per instance or per model class
 */
trait HasUserTracking
{
    /**
     * Indicates if the model should automatically track user changes.
     * Can be set on individual model instances.
     *
     * @var bool
     */
    public $userTracking = true;

    /**
     * Boot the trait.
     */
    protected static function bootHasUserTracking()
    {
        static::creating(function ($model) {
            if ($model->usesUserTracking() && Auth::check() && empty($model->created_by)) {
                $model->created_by = Auth::id();
            }
            if ($model->usesUserTracking() && Auth::check() && empty($model->updated_by)) {
                $model->updated_by = Auth::id();
            }
        });

        static::updating(function ($model) {
            if ($model->usesUserTracking() && Auth::check() && empty($model->updated_by)) {
                $model->updated_by = Auth::id();
            }
        });
    }

    /**
     * Determine if the model uses user tracking.
     * Checks both instance property and class property (if defined).
     *
     * @return bool
     */
    public function usesUserTracking()
    {
        // If userTracking property is explicitly set on the instance, use that
        if (isset($this->userTracking)) {
            return $this->userTracking;
        }

        // Otherwise, check if there's a class-level property (similar to $timestamps)
        if (property_exists($this, 'userTracking')) {
            return $this->userTracking;
        }

        // Default to true
        return true;
    }

    /**
     * Set the value indicating whether the model should track user changes.
     *
     * @param  bool  $value
     * @return $this
     */
    public function setUserTracking($value)
    {
        $this->userTracking = $value;

        return $this;
    }

    /**
     * Get the user who created this record.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this record.
     */
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
