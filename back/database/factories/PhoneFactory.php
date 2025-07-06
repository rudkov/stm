<?php

namespace Database\Factories;

use App\Models\Phone;
use App\Models\CommunicationType;
use Illuminate\Database\Eloquent\Factories\Factory;

class PhoneFactory extends Factory
{
    protected $model = Phone::class;

    public function definition()
    {
        return [
            'info' => $this->faker->phoneNumber(),
            'communication_type_id' => CommunicationType::factory(),
            'phoneable_id' => null, // Will be set when creating
            'phoneable_type' => null, // Will be set when creating
        ];
    }
} 