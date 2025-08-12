<?php

namespace Database\Factories;

use App\Models\Talent;
use App\Models\TalentRelative;
use Illuminate\Database\Eloquent\Factories\Factory;

class TalentRelativeFactory extends Factory
{
    protected $model = TalentRelative::class;

    public function definition()
    {
        return [
            'talent_id' => Talent::all()->random()->id,
            'info' => $this->faker->sentence(6),
        ];
    }
}
