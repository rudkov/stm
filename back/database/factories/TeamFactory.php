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
        // Attempt to pick a random existing user ID (null if no users exist yet)
        $randomUserId = User::inRandomOrder()->value('id');

        return [
            'name' => $this->faker->company(),
            'created_by' => $randomUserId,
            'updated_by' => $randomUserId,
        ];
    }
}
