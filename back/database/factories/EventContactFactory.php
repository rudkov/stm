<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Contact;
use App\Models\Event;
use App\Models\EventChunk;

class EventContactFactory extends Factory
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
        
        foreach($events as $event) {
            $contacts = Contact::where('team_id',$event->team_id)->get()->random(rand(1,2));
            $contact_ids = [];
            foreach($contacts as $contact) {
                $contact_ids[] = $contact->id;
            }
            $event->contacts()->attach($contact_ids);
        }

        $eventChunks = EventChunk::with('event')->get()->random(20);
        
        foreach($eventChunks as $eventChunk) {
            $contacts = Contact::where('team_id',$eventChunk->event->team_id)->get()->random(rand(1,2));
            $contact_ids = [];
            foreach($contacts as $contact) {
                $contact_ids[] = $contact->id;
            }
            $eventChunk->contacts()->attach($contact_ids);
        }
    }
}
