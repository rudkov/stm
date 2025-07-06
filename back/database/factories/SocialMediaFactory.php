<?php

namespace Database\Factories;

use App\Models\SocialMedia;
use App\Models\SocialMediaType;
use Illuminate\Database\Eloquent\Factories\Factory;

class SocialMediaFactory extends Factory
{
    protected $model = SocialMedia::class;

    public function definition()
    {
        return [
            'info' => $this->faker->userName(),
            'social_media_type_id' => SocialMediaType::factory(),
            'social_mediaable_id' => null, // Will be set when creating
            'social_mediaable_type' => null, // Will be set when creating
        ];
    }
} 