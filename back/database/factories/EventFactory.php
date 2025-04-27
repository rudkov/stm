<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Event;
use App\Models\EventType;
use App\Models\Team;
use App\Models\User;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition()
    {
        $users = User::all()->groupBy('team_id');
        $team_id = Team::all()->random()->id;

        return [
            'title' => $this->faker->sentence(6),
            'event_type_id' => EventType::all()->random()->id,
            'notes' => $this->faker->sentence(20),
            'team_id' => $team_id,
            'created_by' => $users[$team_id]->random()->id,
            'updated_by' => $users[$team_id]->random()->id,
        ];
    }
}
