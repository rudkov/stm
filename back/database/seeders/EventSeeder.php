<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Contact;
use App\Models\Event;
use App\Models\EventChunk;
use App\Models\Talent;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = $this->createEvents();
        $this->createEventTalentRelationships($events);
        $this->createEventChunks($events);
        $this->createEventContactRelationships($events);
    }

    /**
     * Create events using factory.
     */
    private function createEvents()
    {
        return Event::factory(50)->create();
    }

    /**
     * Create relationships between events and talents.
     */
    private function createEventTalentRelationships($events): void
    {
        $talents = Talent::all()->groupBy('team_id');

        foreach ($events as $event) {
            $eventTalents = $talents[$event->team_id]->random(rand(0, 3));

            foreach ($eventTalents as $eventTalent) {
                $event->talents()->save($eventTalent, ['cost' => fake()->randomFloat($nbMaxDecimals = 2, $min = 0, $max = 9999999.99)]);
            }
        }
    }

    /**
     * Create event chunks for events.
     */
    private function createEventChunks($events): void
    {
        $this->saveEventChunk($events);

        $events = $events->random(round($events->count() * 0.3));
        $this->saveEventChunk($events);

        $events = $events->random(round($events->count() * 0.3));
        $this->saveEventChunk($events);
    }

    /**
     * Generate random start and end dates for event chunks.
     */
    private function generateStartEndDates(): array
    {
        $minutesArray = [0, 15, 30, 45];
        $minutesDeltaArray = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270];

        $deltaHours = rand(0, 24 * 64);

        $startDate = new \DateTime(); //now
        $startDate->setTime(0, 0, 0); //today 0:00
        $startDate->add(new \DateInterval('PT' . $deltaHours . 'H' . array_rand(array_flip($minutesArray)) . 'M'));

        $endDate = clone $startDate;
        $endDate->add(new \DateInterval('PT' . array_rand(array_flip($minutesDeltaArray)) . 'M'));

        return [
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }

    /**
     * Save event chunks for given events.
     */
    private function saveEventChunk($events): void
    {
        foreach ($events as $event) {
            $dates = $this->generateStartEndDates();
            $eventChunk = new EventChunk();
            $eventChunk->start_date = $dates['start_date'];
            $eventChunk->end_date = $dates['end_date'];
            $eventChunk->event_id = $event->id;
            $eventChunk->save();
        }
    }

    /**
     * Create relationships between events and contacts.
     */
    private function createEventContactRelationships($events): void
    {
        // Create event-contact relationships
        foreach ($events as $event) {
            $contacts = Contact::where('team_id', $event->team_id)->get()->random(rand(1, 2));
            $contact_ids = [];
            foreach ($contacts as $contact) {
                $contact_ids[] = $contact->id;
            }
            $event->contacts()->attach($contact_ids);
        }

        // Create event chunk-contact relationships
        $eventChunks = EventChunk::with('event')->get()->random(20);
        
        foreach ($eventChunks as $eventChunk) {
            $contacts = Contact::where('team_id', $eventChunk->event->team_id)->get()->random(rand(1, 2));
            $contact_ids = [];
            foreach ($contacts as $contact) {
                $contact_ids[] = $contact->id;
            }
            $eventChunk->contacts()->attach($contact_ids);
        }
    }
}
