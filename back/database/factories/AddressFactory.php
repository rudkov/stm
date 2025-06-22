<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\CommunicationType;
use Illuminate\Database\Eloquent\Factories\Factory;

class AddressFactory extends Factory
{
    protected $model = Address::class;

    public function definition()
    {
        return [
            'info' => $this->faker->address(),
            'communication_type_id' => CommunicationType::factory(),
            'addressable_id' => null, // Will be set when creating
            'addressable_type' => null, // Will be set when creating
        ];
    }
} 