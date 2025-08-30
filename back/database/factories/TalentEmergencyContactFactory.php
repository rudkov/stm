<?php

namespace Database\Factories;

use App\Models\Talent;
use App\Models\TalentEmergencyContact;
use Illuminate\Database\Eloquent\Factories\Factory;

class TalentEmergencyContactFactory extends Factory
{
    protected $model = TalentEmergencyContact::class;

    public function definition()
    {
        return [
            'talent_id' => Talent::all()->random()->id,
            'info' => $this->faker->sentence(6),
        ];
    }
}
