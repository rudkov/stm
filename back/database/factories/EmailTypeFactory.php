<?php

namespace Database\Factories;

use App\Models\EmailType;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailTypeFactory extends Factory
{
    protected $model = EmailType::class;

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->word,
            'weight' => $this->faker->numberBetween(0, 10),
        ];
    }
} 