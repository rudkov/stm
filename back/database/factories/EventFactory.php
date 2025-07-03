<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Company;
use App\Models\Event;
use App\Models\EventType;
use App\Models\User;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition()
    {
        $users = User::all()->groupBy('team_id');
        $team_id = $users->keys()->random();

        return [
            'title' => $this->faker->sentence(6),
            'event_type_id' => EventType::all()->random()->id,
            'notes' => $this->faker->sentence(20),
            'client_id' => [null, Company::where('team_id', $team_id)->get()->random()->id][rand(0, 1)],
            'team_id' => $team_id,
            'created_by' => $users[$team_id]->random()->id,
            'updated_by' => $users[$team_id]->random()->id,
        ];
    }
}
