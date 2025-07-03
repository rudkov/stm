<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Http\Requests\ContactRequest;
use App\Http\Resources\ContactCollection;
use function App\Helpers\sync_morph_many;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
            ->leftJoin('email_types', 'email_types.id', '=', 'emails.email_type_id')
            ->leftJoin('phones', function ($join) {
                $join->on('contacts.id', '=', 'phones.phoneable_id')
                    ->where('phones.phoneable_type', '=', 'contact');
            })
            ->leftJoin('phone_types', 'phone_types.id', '=', 'phones.phone_type_id')

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
            'companies',
            'phones',
            'phones.type',
            'emails',
            'emails.type',
            'messengers',
            'messengers.type',
            'createdBy',
            'updatedBy',
        );
        return $contact->toResource();
    }

    public function update(ContactRequest $request, Contact $contact)
    {
        // Process the validated data
        $validated = $request->validated();
        DB::transaction(function () use ($contact, $validated) {
            $contact->update($validated);

            //COMPANIES & JOB TITLES START
            $companies = array();
            foreach (collect($validated['companies'] ?? []) as $company) {
                $companies[$company['id']] = ['job_title' => $company['job_title']];
            }
            $contact->companies()->sync($companies);
            //COMPANIES & JOB TITLES END

            sync_morph_many($contact->phones(), $validated['phones'] ?? [], ['phone_type_id', 'info']);
            sync_morph_many($contact->emails(), $validated['emails'] ?? [], ['email_type_id', 'info']);
            sync_morph_many($contact->messengers(), $validated['messengers'] ?? [], ['messenger_type_id', 'info']);
        });

        return $this->show($contact);
    }

    public function store(ContactRequest $request)
    {
        $contact = new Contact();
        $validated = $request->validated();

        DB::transaction(function () use ($contact, $validated) {
            $user = Auth::user();

            $contact->fill($validated);
            $contact->team_id = $user->team->id;
            $contact->save();

            //COMPANIES & JOB TITLES START
            $companies = array();
            foreach (collect($validated['companies'] ?? []) as $company) {
                $companies[$company['id']] = ['job_title' => $company['job_title']];
            }
            $contact->companies()->sync($companies);
            //COMPANIES & JOB TITLES END

            sync_morph_many($contact->phones(), $validated['phones'] ?? [], ['phone_type_id', 'info']);
            sync_morph_many($contact->emails(), $validated['emails'] ?? [], ['email_type_id', 'info']);
            sync_morph_many($contact->messengers(), $validated['messengers'] ?? [], ['messenger_type_id', 'info']);
        });

        return $this->show($contact);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(null, 204);
    }
}
