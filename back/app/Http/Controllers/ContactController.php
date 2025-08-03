<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\ContactRequest;
use App\Http\Requests\ContactSearchRequest;
use App\Http\Resources\ContactCollection;
use App\Models\Contact;
use App\Queries\ContactQuery;

use function App\Helpers\sync_relation;

class ContactController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Contact::class);
    }

    private function sync_relations(Contact $contact, array $validated)
    {
        sync_relation($contact->addresses(), $validated['addresses'] ?? [], ['communication_type_id' => 'type.id', 'info']);
        sync_relation($contact->companies(), $validated['companies'] ?? [], ['job_title']);
        sync_relation($contact->emails(), $validated['emails'] ?? [], ['communication_type_id' => 'type.id', 'info']);
        sync_relation($contact->messengers(), $validated['messengers'] ?? [], ['messenger_type_id' => 'type.id', 'info']);
        sync_relation($contact->phones(), $validated['phones'] ?? [], ['communication_type_id' => 'type.id', 'info']);
        sync_relation($contact->socialMedias(), $validated['social_medias'] ?? [], ['social_media_type_id' => 'type.id', 'info']);
        sync_relation($contact->weblinks(), $validated['weblinks'] ?? [], ['info']);
    }

    public function search(ContactSearchRequest $request)
    {
        $this->authorize('viewAny', Contact::class);

        $filters = $request->validated();

        $query = new ContactQuery(Auth::user());
        $contacts = $query->applyFilters($filters)->get();
        return new ContactCollection($contacts);
    }

    public function show(Contact $contact)
    {
        $contact->load(
            'addresses',
            'addresses.type',
            'companies',
            'emails',
            'emails.type',
            'messengers',
            'messengers.type',
            'phones',
            'phones.type',
            'socialMedias',
            'socialMedias.type',
            'weblinks',
            'createdBy',
            'updatedBy',
        );
        return $contact->toResource();
    }

    public function update(ContactRequest $request, Contact $contact)
    {
        $validated = $request->validated();
        DB::transaction(function () use ($contact, $validated) {
            $contact->update($validated);

            $this->sync_relations($contact, $validated);
        });

        return $this->show($contact);
    }

    public function store(ContactRequest $request)
    {
        $contact = new Contact();
        $validated = $request->validated();

        DB::transaction(function () use ($contact, $validated) {
            $contact->fill($validated);
            $contact->team_id = Auth::user()->team_id;
            $contact->save();

            $this->sync_relations($contact, $validated);
        });

        return $this->show($contact);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(null, 204);
    }
}
