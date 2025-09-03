<?php

namespace Database\Factories;

use App\Models\SocialMediaType;
use Illuminate\Database\Eloquent\Factories\Factory;

class SocialMediaTypeFactory extends Factory
{
    protected $model = SocialMediaType::class;

    public function definition()
    {
        $types = [
            ['Facebook', 'https://www.facebook.com/', 'facebook'],
            ['Instagram', 'https://www.instagram.com/', 'instagram'],
            ['TikTok', 'https://www.tiktok.com/', 'tiktok'],
            ['X', 'https://x.com/', 'twitter'],
            ['YouTube', 'https://www.youtube.com/', 'youtube'],
        ];
        
        $type = $this->faker->unique()->randomElement($types);
        
        return [
            'name' => $type[0],
            'url' => $type[1],
            'system_name' => $type[2],
        ];
    }
} 