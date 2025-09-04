<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Contact;
use App\Models\User;

class ContactFactory extends Factory
{
    protected $model = Contact::class;

    public function definition(): array
    {
        $users = User::all()->groupBy('team_id');
        $team_id = $users->keys()->random();

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'job_title' => $this->faker->jobTitle(),
            'notes' => $this->faker->sentence(20),
            'team_id' => $team_id,
            'created_by' => $users[$team_id]->random()->id,
            'updated_by' => $users[$team_id]->random()->id,
        ];
    }
}
