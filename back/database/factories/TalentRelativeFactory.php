<?php

namespace Database\Factories;

use App\Models\Talent;
use App\Models\TalentRelativeType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TalentRelative>
 */
class TalentRelativeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'talent_id' => Talent::all()->random()->id,
            'relative_type_id' => TalentRelativeType::all()->random()->id,
            'info' => $this->faker->sentence(6),
        ];
    }
}
