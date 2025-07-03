<?php

namespace Database\Factories;

use App\Models\CommunicationType;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommunicationTypeFactory extends Factory
{
    protected $model = CommunicationType::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'type' => $this->faker->randomElement(CommunicationType::getDefaultTypes()),
            'weight' => null, // Will be set in configure method if not explicitly provided
            'team_id' => Team::factory(),
        ];
    }

    /**
     * Configure the factory to set unique weights.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (CommunicationType $communicationType) {
            // Only calculate weight if it wasn't explicitly set
            if ($communicationType->weight === null) {
                // Calculate the next available weight for this type and team
                $maxWeight = CommunicationType::where('type', $communicationType->type)
                    ->where('team_id', $communicationType->team_id)
                    ->max('weight');
                
                $communicationType->weight = ($maxWeight ?? -1) + 1;
            }
        });
    }
}
