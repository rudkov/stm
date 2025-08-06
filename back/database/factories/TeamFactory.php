<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Team;
use App\Models\User;

class TeamFactory extends Factory
{
    protected $model = Team::class;

    public function definition()
    {
        $users = User::all()->groupBy('team_id');
        $team_id = $users->keys()->random();

        return [
            'name' => $this->faker->company(),
            'created_by' => $users[$team_id]->random()->id,
            'updated_by' => $users[$team_id]->random()->id,
        ];
    }
}
