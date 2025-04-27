<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\EventChunk;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventChunkFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EventChunk::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // $minutesArray = [0,15,30,45];
        // $minutesDeltaArray = [15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270];

        // $deltaHours = rand(0,24*48);

        // $startDate = new \DateTime();
        // $startDate->setTime(0,0,0);
        // $startDate->add(new \DateInterval('PT'.$deltaHours.'H'.array_rand(array_flip($minutesArray)).'M'));

        // $endDate = clone $startDate;
        // $endDate->add(new \DateInterval('PT'.array_rand(array_flip($minutesDeltaArray)).'M'));

        // return [
        //     'start_date' => $startDate,
        //     'end_date' => $endDate,
        //     'event_id' => Event::all()->random()->id,
        // ];
    }

    public function run()
    {
        $events = Event::all();
        $this->saveEventChunk($events);

        $events = $events->random(round($events->count()*0.3));
        $this->saveEventChunk($events);

        $events = $events->random(round($events->count()*0.3));
        $this->saveEventChunk($events);
    }

    private function generateStartEndDates()
    {
        $minutesArray = [0,15,30,45];
        $minutesDeltaArray = [15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270];

        $deltaHours = rand(0,24*64);

        $startDate = new \DateTime(); //now
        $startDate->setTime(0,0,0); //today 0:00
        $startDate->add(new \DateInterval('PT'.$deltaHours.'H'.array_rand(array_flip($minutesArray)).'M'));

        $endDate = clone $startDate;
        $endDate->add(new \DateInterval('PT'.array_rand(array_flip($minutesDeltaArray)).'M'));

        return [
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }

    private function saveEventChunk($events)
    {
        foreach($events as $event) {
            $dates = $this->generateStartEndDates();
            $eventChunk = new EventChunk();
            $eventChunk->start_date = $dates['start_date'];
            $eventChunk->end_date = $dates['end_date'];
            $eventChunk->event_id = $event->id;
            $eventChunk->save();
        }
    }
}
