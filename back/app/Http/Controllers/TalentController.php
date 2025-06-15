<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Http\Requests\TalentRequest;
use App\Http\Requests\TalentSearchRequest;
use App\Http\Resources\TalentCollection;
use App\Models\Talent;
use App\Queries\TalentQuery;

use function App\Helpers\sync_morph_many;
use function App\Helpers\sync_has_many;

class TalentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Talent::class);
    }

    public function index()
    {
        $emptyRequest = new TalentSearchRequest();
        return $this->search($emptyRequest);
    }

    public function search(TalentSearchRequest $request)
    {
        $query = new TalentQuery(Auth::user());
        $talents = $query->applyFilters($request->validated())->get();
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

            $talent->citizenships()->sync($validated['citizenships'] ?? []);
            $talent->languages()->sync($validated['languages'] ?? []);

            sync_has_many($talent->relatives(), $validated['relatives'] ?? [], ['relative_type_id', 'info']);

            sync_morph_many($talent->addresses(), $validated['addresses'] ?? [], ['address_type_id', 'info']);
            sync_morph_many($talent->emails(), $validated['emails'] ?? [], ['email_type_id', 'info']);
            sync_morph_many($talent->messengers(), $validated['messengers'] ?? [], ['messenger_type_id', 'info']);
            sync_morph_many($talent->phones(), $validated['phones'] ?? [], ['phone_type_id', 'info']);
            sync_morph_many($talent->socialMedias(), $validated['social_medias'] ?? [], ['social_media_type_id', 'info']);
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

            $talent->citizenships()->sync($validated['citizenships'] ?? []);
            $talent->languages()->sync($validated['languages'] ?? []);

            sync_has_many($talent->relatives(), $validated['relatives'] ?? [], ['relative_type_id', 'info']);

            sync_morph_many($talent->addresses(), $validated['addresses'] ?? [], ['address_type_id', 'info']);
            sync_morph_many($talent->emails(), $validated['emails'] ?? [], ['email_type_id', 'info']);
            sync_morph_many($talent->messengers(), $validated['messengers'] ?? [], ['messenger_type_id', 'info']);
            sync_morph_many($talent->phones(), $validated['phones'] ?? [], ['phone_type_id', 'info']);
            sync_morph_many($talent->socialMedias(), $validated['social_medias'] ?? [], ['social_media_type_id', 'info']);
        });

        return $this->show($talent);
    }

    public function destroy(Talent $talent)
    {
        $talent->delete();
        return response()->json(null, 204);
    }

    public function updateCurrentLocation(TalentRequest $request, Talent $talent)
    {
        $talent->timestamps = false;
        $talent->userTracking = false;
        $talent->update(['location' => $request->validated('location')]);
        return $this->show($talent);
    }

    public function locations()
    {
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
