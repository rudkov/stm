<?php

namespace Database\Factories;

use App\Models\Model;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Event;
use App\Models\Talent;

class EventTalentFactory extends Factory
{
    public function definition()
    {
        return [
            //
        ];
    }

    public function run()
    {
        $events = Event::all();
        $talents = Talent::all()->groupBy('team_id');

        foreach($events as $event) {
            $eventTalents = $talents[$event->team_id]->random(rand(0,3));

            foreach($eventTalents as $eventTalent) {
                $event->talents()->save($eventTalent, ['cost' => $this->faker->randomFloat($nbMaxDecimals = 2, $min = 0, $max = 9999999.99)]);
            }
        }
    }
}
