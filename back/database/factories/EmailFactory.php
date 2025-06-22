<?php

namespace Database\Factories;

use App\Models\Email;
use App\Models\CommunicationType;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailFactory extends Factory
{
    protected $model = Email::class;

    public function definition()
    {
        return [
            'info' => $this->faker->safeEmail(),
            'communication_type_id' => CommunicationType::factory(),
            'emailable_id' => null, // Will be set when creating
            'emailable_type' => null, // Will be set when creating
        ];
    }
}
