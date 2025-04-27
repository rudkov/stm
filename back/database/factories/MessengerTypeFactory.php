<?php

namespace Database\Factories;

use App\Models\MessengerType;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessengerTypeFactory extends Factory
{
    protected $model = MessengerType::class;

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->word,
            'url' => $this->faker->url,
            'system_name' => $this->faker->unique()->slug,
        ];
    }
} 