<?php

namespace Database\Factories;

use App\Models\TalentBoard;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class TalentBoardFactory extends Factory
{
    protected $model = TalentBoard::class;

    public function definition()
    {
        return [
            'name' => $this->faker->words(3, true),
            'team_id' => Team::factory(),
        ];
    }
}
