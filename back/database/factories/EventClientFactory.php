<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Company;
use App\Models\Event;

class EventClientFactory extends Factory
{
    public function definition(): array
    {
        return [
            //
        ];
    }

    public function run()
    {
        $events = Event::all();
        $companies = Company::all()->groupBy('team_id');

        foreach ($events as $event) {
            $company = $companies[$event->team_id]->random();
            $company->event()->save($event);
        }
    }
}
