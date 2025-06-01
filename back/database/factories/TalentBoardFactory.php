<?php

namespace Database\Factories;

use App\Models\TalentBoard;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TalentBoardFactory extends Factory
{
    protected $model = TalentBoard::class;

    public function definition()
    {
        return [
            'name' => $this->faker->words(3, true),
            'team_id' => Team::factory(),
            'created_by' => function (array $attributes) {
                return User::factory()->create(['team_id' => $attributes['team_id']])->id;
            },
            'updated_by' => function (array $attributes) {
                return $attributes['created_by'];
            },
        ];
    }
} 