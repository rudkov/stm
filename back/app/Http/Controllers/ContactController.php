<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Http\Requests\ContactRequest;
use App\Http\Resources\ContactCollection;
use App\Models\Contact;

use function App\Helpers\sync_relation;

class ContactController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Contact::class);
    }

    public function index()
    {
        $innerQuery = DB::table('contacts')
            ->where('contacts.team_id', Auth::user()->team_id)
            ->leftJoin('emails', function ($join) {
                $join->on('contacts.id', '=', 'emails.emailable_id')
                    ->where('emails.emailable_type', '=', 'contact');
            })
            ->leftJoin('communication_types as email_types', 'email_types.id', '=', 'emails.communication_type_id')
            ->leftJoin('phones', function ($join) {
                $join->on('contacts.id', '=', 'phones.phoneable_id')
                    ->where('phones.phoneable_type', '=', 'contact');
            })
            ->leftJoin('communication_types as phone_types', 'phone_types.id', '=', 'phones.communication_type_id')

            ->leftJoin('company_contact', 'company_contact.contact_id', '=', 'contacts.id')
            ->leftJoin('companies', 'company_contact.company_id', '=', 'companies.id')

            ->whereNull('contacts.deleted_at')
            ->orderBy('contacts.first_name', 'asc')
            ->orderBy('contacts.last_name', 'asc')
            ->orderBy('companies.name', 'asc')
            ->orderBy('email_types.weight', 'ASC')
            ->orderBy('phone_types.weight', 'ASC')
            ->select([
                'contacts.id',
                'contacts.first_name',
                'contacts.last_name',
                'emails.info as email',
                'email_types.weight as email_weight',
                'phones.info as phone',
                'phone_types.weight as phone_weight',
                'company_contact.job_title as job_title',
                'companies.name as company_name',
                DB::raw('ROW_NUMBER() OVER (PARTITION BY contacts.id 
                        ORDER BY email_types.weight ASC, 
                                 phone_types.weight ASC
                ) AS row_num')

            ]);
        $contacts = DB::table(function ($query) use ($innerQuery) {
            $query->fromSub($innerQuery, 'ranked_contacts');
        })
            ->where('row_num', 1)
            ->get();

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

            sync_relation($contact->addresses(), $validated['addresses'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($contact->companies(), $validated['companies'] ?? [], ['job_title']);
            sync_relation($contact->emails(), $validated['emails'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($contact->messengers(), $validated['messengers'] ?? [], ['messenger_type_id' => 'type.id', 'info']);
            sync_relation($contact->phones(), $validated['phones'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($contact->socialMedias(), $validated['social_medias'] ?? [], ['social_media_type_id' => 'type.id', 'info']);
            sync_relation($contact->weblinks(), $validated['weblinks'] ?? [], ['info']);
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

            sync_relation($contact->addresses(), $validated['addresses'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($contact->companies(), $validated['companies'] ?? [], ['job_title']);
            sync_relation($contact->emails(), $validated['emails'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($contact->messengers(), $validated['messengers'] ?? [], ['messenger_type_id' => 'type.id', 'info']);
            sync_relation($contact->phones(), $validated['phones'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($contact->socialMedias(), $validated['social_medias'] ?? [], ['social_media_type_id' => 'type.id', 'info']);
            sync_relation($contact->weblinks(), $validated['weblinks'] ?? [], ['info']);
        });

        return $this->show($contact);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(null, 204);
    }
}
