<?php

namespace Database\Factories;

use App\Models\CommunicationType;
use App\Models\Team;
use App\Helpers\CommunicationTypeHelper;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommunicationTypeFactory extends Factory
{
    protected $model = CommunicationType::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'type' => $this->faker->randomElement(CommunicationTypeHelper::getTypes()),
            'weight' => $this->faker->numberBetween(0, 10),
            'team_id' => Team::factory(),
        ];
    }
}
