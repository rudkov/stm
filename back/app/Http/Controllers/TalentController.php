<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Http\Requests\TalentRequest;
use App\Http\Requests\TalentSearchRequest;
use App\Http\Requests\TalentLocationRequest;
use App\Http\Resources\TalentCollection;
use App\Models\Talent;
use App\Queries\TalentQuery;

use function App\Helpers\sync_relation;

class TalentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Talent::class);
    }

    private function sync_relations(Talent $talent, array $validated)
    {
        $talent->citizenships()->sync($validated['citizenships'] ?? []);
        $talent->languages()->sync($validated['languages'] ?? []);

        sync_relation($talent->addresses(), $validated['addresses'] ?? [], ['communication_type_id' => 'type.id', 'info']);
        sync_relation($talent->emails(), $validated['emails'] ?? [], ['communication_type_id' => 'type.id', 'info']);
        sync_relation($talent->messengers(), $validated['messengers'] ?? [], ['messenger_type_id' => 'type.id', 'info']);
        sync_relation($talent->phones(), $validated['phones'] ?? [], ['communication_type_id' => 'type.id', 'info']);
        sync_relation($talent->relatives(), $validated['relatives'] ?? [], ['relative_type_id' => 'type.id', 'info']);
        sync_relation($talent->socialMedias(), $validated['social_medias'] ?? [], ['social_media_type_id' => 'type.id', 'info']);
        sync_relation($talent->weblinks(), $validated['weblinks'] ?? [], ['info']);
    }

    public function index()
    {
        return $this->search(new TalentSearchRequest());
    }

    public function search(TalentSearchRequest $request)
    {
        $this->authorize('viewAny', Talent::class);

        $filters = request()->hasAny(array_keys($request->rules()))
            ? $request->validated()
            : [];

        $query = new TalentQuery(Auth::user());
        $talents = $query->applyFilters($filters)->get();
        return new TalentCollection($talents);
    }

    public function show(Talent $talent)
    {
        $talent->load([
            'addresses',
            'addresses.type',
            'board',
            'citizenships',
            'cupSize',
            'dressSize',
            'emails',
            'emails.type',
            'eyeColor',
            'gender',
            'hairColor',
            'hairLength',
            'languages',
            'manager',
            'maritalStatus',
            'messengers',
            'messengers.type',
            'motherAgency',
            'phones',
            'phones.type',
            'relatives',
            'relatives.type',
            'shirtSize',
            'shoeSize',
            'skinColor',
            'socialMedias',
            'socialMedias.type',
            'suitCut',
            'weblinks',
            'createdBy',
            'updatedBy',
        ]);
        return $talent->toResource();
    }

    public function update(TalentRequest $request, Talent $talent)
    {
        $validated = $request->validated();
        DB::transaction(function () use ($talent, $validated) {
            $talent->update($validated);

            $this->sync_relations($talent, $validated);
        });

        return $this->show($talent);
    }

    public function store(TalentRequest $request)
    {
        $talent = new Talent();
        $validated = $request->validated();

        DB::transaction(function () use ($talent, $validated) {
            $talent->fill($validated);
            $talent->team_id = Auth::user()->team_id;
            $talent->save();

            $this->sync_relations($talent, $validated);
        });

        return $this->show($talent);
    }

    public function destroy(Talent $talent)
    {
        $talent->delete();
        return response()->json(null, 204);
    }

    public function updateLocation(TalentLocationRequest $request, Talent $talent)
    {
        $this->authorize('update', $talent);

        $validated = $request->validated();
        $talent->timestamps = false;
        $talent->userTracking = false;
        $talent->location = $validated['location'];
        $talent->save();
        return $this->show($talent);
    }

    public function locations()
    {
        $this->authorize('viewAny', Talent::class);

        $uniqueLocations = DB::table('talents')
            ->select('location')
            ->where('team_id', Auth::user()->team_id)
            ->whereNull('talents.deleted_at')
            ->distinct()
            ->orderByRaw('CASE WHEN location IS NULL THEN 0 ELSE 1 END, location')
            ->pluck('location');
        return $uniqueLocations;
    }

    public function managers()
    {
        $this->authorize('viewAny', Talent::class);

        $uniqueManagers = DB::table('talents')
            ->leftJoin('users', 'talents.manager_id', '=', 'users.id')
            ->where('talents.team_id', Auth::user()->team_id)
            ->whereNull('talents.deleted_at')
            ->distinct()
            ->orderBy('users.name')
            ->get(['users.id', 'users.name']);
        return $uniqueManagers;
    }
}
