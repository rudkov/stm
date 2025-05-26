<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class EventController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $startDate = new \DateTime();
        $startDate->setDate($request->year, $request->month, $request->day);
        $startDate->setTime(0, 0, 0); //0:00

        $endDate = clone $startDate;

        // // We add 13D to fill empty dates from the upcoming month (2 weeks if the last day of the month is Monday)
        // $endDate->add(new \DateInterval('P1M13D'));

        // //We subtract 6 days because the 1st day of the month may be the Sunday, and we have to fill the last week of the previous month
        // $startDate->sub(new \DateInterval('P6D'));

        // We add 2 months more, so it could look like a prefetched list
        $endDate->add(new \DateInterval('P3M'));

        //We subtract 1 month more, so it could look like a prefetched list
        $startDate->sub(new \DateInterval('P2M'));

        // While upgrading Laravel from 9 to 10, I should have updated the DB Expressions:
        // https://laravel.com/docs/10.x/upgrade#database-expressions
        // If there is an error on line 54, try this:
        // $expression = DB::raw('select 1');
        // $string = $expression->getValue(DB::connection()->getQueryGrammar());

        $fetchedEvents = DB::table('event_chunks')
            ->join('events', 'event_chunks.event_id', '=', 'events.id')
            ->join('event_types', 'events.event_type_id', '=', 'event_types.id')
            ->leftJoin('event_talent', 'events.id', '=', 'event_talent.event_id')
            ->leftJoin('talents', 'event_talent.talent_id', '=', 'talents.id')
            ->select(
                'events.id as id',
                'event_chunks.id as event_chunk_id',
                'events.title',
                'event_types.system_name as event_type_system_name',
                'event_chunks.start_date',
                'event_chunks.end_date',
                'talents.id as talent_id',
                DB::raw('CONCAT(talents.first_name, " ", talents.last_name) AS talent_name'),
            )
            ->where('events.team_id', '=', $user->team->id)
            ->where('event_chunks.start_date', '>=', $startDate)
            ->where('event_chunks.end_date', '<', $endDate)
            ->whereNull('event_chunks.deleted_at')
            ->when($request->talents, function ($query, $talent) {
                return $query->whereIn('event_talent.talent_id', $talent);
            })
            ->when($request->eventTypes, function ($query, $eventType) {
                return $query->whereIn('events.event_type_id', $eventType);
            })
            ->when($request->clients, function ($query, $clients) {
                return $query->where(function ($query) use ($clients) {
                    foreach ($clients as $client) {
                        $query->orWhere(function ($query) use ($client) {
                            $query->where('events.clientable_id', $client['id'])
                                ->where('events.clientable_type', $client['type']);
                        });
                    }
                });
            })
            ->orderBy('event_chunks.start_date', 'asc')
            ->orderBy('talent_name', 'asc')
            ->get();

        $events = [];
        $talents = [];

        foreach ($fetchedEvents as $event) {
            if ($event->talent_name) {
                $talents[$event->event_chunk_id][$event->talent_id]['id'] = $event->talent_id;
                $talents[$event->event_chunk_id][$event->talent_id]['name'] = $event->talent_name;
            }
            unset($event->talent_id, $event->talent_name);

            $events[$event->event_chunk_id] = $event;
        }

        foreach ($events as $key => $event) {
            if (array_key_exists($key, $talents)) {
                $event->talents = array_values($talents[$key]);
            }
        }

        $events = array_values($events);

        return $events;
    }

    public function show(Request $request, $id)
    {
        $event = Event::where('id', $id)
            ->with([
                'eventChunks',
                'eventType',
                'talents',
                'clientable',
                'contacts',
                'createdBy',
                'updatedBy',
            ])
            ->firstOrFail();

        if ($request->user()->cannot('view', $event)) {
            abort(403);
        }

        return response()->json($event, 200);
    }
}
