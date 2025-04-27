<?php

namespace Database\Factories;

use App\Models\PhoneType;
use Illuminate\Database\Eloquent\Factories\Factory;

class PhoneTypeFactory extends Factory
{
    protected $model = PhoneType::class;

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->word,
            'weight' => $this->faker->numberBetween(0, 10),
        ];
    }
} 