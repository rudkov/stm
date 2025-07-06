<?php

namespace Database\Factories;

use App\Models\Messenger;
use App\Models\MessengerType;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessengerFactory extends Factory
{
    protected $model = Messenger::class;

    public function definition()
    {
        return [
            'info' => $this->faker->userName(),
            'messenger_type_id' => MessengerType::factory(),
            'messengerable_id' => null, // Will be set when creating
            'messengerable_type' => null, // Will be set when creating
        ];
    }
} 