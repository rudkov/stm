<?php

namespace Database\Factories;

use App\Models\TalentRelativeType;
use Illuminate\Database\Eloquent\Factories\Factory;

class TalentRelativeTypeFactory extends Factory
{
    protected $model = TalentRelativeType::class;

    public function definition()
    {
        $types = ['Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt', 'Child', 'Grandmother', 'Grandfather', 'Husband', 'Wife'];

        return [
            'name' => $this->faker->randomElement($types),
        ];
    }
}
