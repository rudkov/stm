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
            'sort_order' => null, // Will be set in configure method if not explicitly provided
            'team_id' => Team::factory(),
        ];
    }

    /**
     * Configure the factory to set unique sort_orders.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (CommunicationType $communicationType) {
            // Only calculate sort_order if it wasn't explicitly set
            if ($communicationType->sort_order === null) {
                // Calculate the next available sort_order for this type and team
                $maxSortOrder = CommunicationType::where('type', $communicationType->type)
                    ->where('team_id', $communicationType->team_id)
                    ->max('sort_order');
                
                $communicationType->sort_order = ($maxSortOrder ?? -1) + 1;
            }
        });
    }
}
