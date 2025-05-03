<?php

namespace App\Http\Controllers;

use App\Models\CompanyContact;
use App\Models\Contact;
use App\Models\ContactEmail;
use App\Models\ContactMessenger;
use App\Models\ContactPhone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ContactCollection;

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
            ->leftJoin('contact_emails', 'contacts.id', '=', 'contact_emails.contact_id')
            ->leftJoin('email_types', 'email_types.id', '=', 'contact_emails.email_type_id')
            ->leftJoin('contact_phones', 'contacts.id', '=', 'contact_phones.contact_id')
            ->leftJoin('phone_types', 'phone_types.id', '=', 'contact_phones.phone_type_id')

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
                'contact_emails.info as email',
                'email_types.weight as email_weight',
                'contact_phones.info as phone',
                'phone_types.weight as phone_weight',
                'company_contact.job_title as job_title',
                'companies.name as company_name',
                DB::raw('ROW_NUMBER() OVER (PARTITION BY contacts.id 
                        ORDER BY email_types.weight ASC, 
                                 phone_types.weight ASC
                ) AS row_num')

            ]);
        $contacts = DB::table(function($query) use ($innerQuery) {
            $query->fromSub($innerQuery, 'ranked_contacts');
        })
        ->where('row_num', 1)
        ->get();
        
        return new ContactCollection($contacts);
    }

    public function show(Contact $contact)
    {
        $contact->load('companies',
            'phones',
            'phones.type',
            'emails',
            'emails.type',
            'messengers',
            'messengers.type',
            'createdBy',
            'updatedBy',
        );
        return $contact;
    }

    public function update(Request $request, Contact $contact)
    {
        $contact->updated_by = Auth::user()->id;

        //COMPANIES & JOB TITLES START
        $companies = array();
        foreach ($request->companies as $company) {
            $companies[$company['id']] = ['job_title' => $company['pivot']['job_title']];
        }
        $contact->companies()->sync($companies);
        //COMPANIES & JOB TITLES END

        //PHONES START
        $phones['upsert'] = array();
        $phones['delete'] = array();

        $newPhones = collect($request->phones);
        $oldPhones = collect($contact->phones);

        foreach ($oldPhones as $phone) {
            if (!$newPhones->contains('id', $phone['id'])) {
                $phones['delete'][] = $phone['id'];
            }
        }

        foreach ($newPhones as $phone) {
            if (array_key_exists('id', $phone)) {
                $oldPhone = ContactPhone::where('id', $phone['id'])->firstOrFail();

                if (@$phone['phone_type_id'] || @$phone['info']) {
                    if (
                        $oldPhone['phone_type_id'] != @$phone['phone_type_id'] ||
                        $oldPhone['info'] != @$phone['info']
                    ) {
                        $oldPhone->phone_type_id = @$phone['phone_type_id'];
                        $oldPhone->info = @$phone['info'];
                        $phones['upsert'][] = $oldPhone;
                    }
                } else {
                    $phones['delete'][] = $phone['id'];
                }
            } else {
                if (@$phone['phone_type_id'] || @$phone['info']) {
                    $newPhone = new ContactPhone();
                    $newPhone->phone_type_id = @$phone['phone_type_id'];
                    $newPhone->info = @$phone['info'];
                    $phones['upsert'][] = $newPhone;
                }
            }
        }
        //PHONES END

        //EMAILS START
        $emails['upsert'] = array();
        $emails['delete'] = array();

        $newEmails = collect($request->emails);
        $oldEmails = collect($contact->emails);

        foreach ($oldEmails as $email) {
            if (!$newEmails->contains('id', $email['id'])) {
                $emails['delete'][] = $email['id'];
            }
        }

        foreach ($newEmails as $email) {
            if (array_key_exists('id', $email)) {
                $oldEmail = ContactEmail::where('id', $email['id'])->firstOrFail();

                if (@$email['email_type_id'] || @$email['info']) {
                    if (
                        $oldEmail['email_type_id'] != @$email['email_type_id'] ||
                        $oldEmail['info'] != @$email['info']
                    ) {
                        $oldEmail->email_type_id = @$email['email_type_id'];
                        $oldEmail->info = @$email['info'];
                        $emails['upsert'][] = $oldEmail;
                    }
                } else {
                    $emails['delete'][] = $email['id'];
                }
            } else {
                if (@$email['email_type_id'] || @$email['info']) {
                    $newEmail = new ContactEmail();
                    $newEmail->email_type_id = @$email['email_type_id'];
                    $newEmail->info = @$email['info'];
                    $emails['upsert'][] = $newEmail;
                }
            }
        }
        //EMAILS END

        //MESSENGERS START
        $messengers['upsert'] = array();
        $messengers['delete'] = array();

        $newMessengers = collect($request->messengers);
        $oldMessengers = collect($contact->messengers);

        foreach ($oldMessengers as $item) {
            if (!$newMessengers->contains('id', $item['id'])) {
                $messengers['delete'][] = $item['id'];
            }
        }

        foreach ($newMessengers as $item) {
            if (array_key_exists('id', $item)) {
                $oldMessenger = ContactMessenger::where('id', $item['id'])->firstOrFail();

                if (@$item['messenger_type_id'] || @$item['info']) {
                    if (
                        $oldMessenger['messenger_type_id'] != @$item['messenger_type_id'] ||
                        $oldMessenger['info'] != @$item['info']
                    ) {
                        $oldMessenger->messenger_type_id = @$item['messenger_type_id'];
                        $oldMessenger->info = @$item['info'];
                        $messengers['upsert'][] = $oldMessenger;
                    }
                } else {
                    $messengers['delete'][] = $item['id'];
                }
            } else {
                if (@$item['messenger_type_id'] || @$item['info']) {
                    $newMessenger = new ContactMessenger();
                    $newMessenger->messenger_type_id = @$item['messenger_type_id'];
                    $newMessenger->info = @$item['info'];
                    $messengers['upsert'][] = $newMessenger;
                }
            }
        }
        //MESSENGERS END

        DB::transaction(function () use ($contact, $request, $phones, $emails, $messengers) {
            $contact->phones()->whereIn('id', $phones['delete'])->delete();
            $contact->phones()->saveMany($phones['upsert']);

            $contact->emails()->whereIn('id', $emails['delete'])->delete();
            $contact->emails()->saveMany($emails['upsert']);

            $contact->messengers()->whereIn('id', $messengers['delete'])->delete();
            $contact->messengers()->saveMany($messengers['upsert']);

            $contact->update($request->all());
        });

        return response()->json($this->show($contact), 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'comment' => 'nullable|string',
            'companies' => 'array|nullable',
            'companies.*.id' => 'required|exists:companies,id',
            'companies.*.pivot.job_title' => 'nullable|string|max:255',
            'phones' => 'array|nullable',
            'phones.*.phone_type_id' => 'required|exists:phone_types,id',
            'phones.*.info' => 'required|string|max:255',
            'emails' => 'array|nullable',
            'emails.*.email_type_id' => 'required|exists:email_types,id',
            'emails.*.info' => 'required|email|max:255',
            'messengers' => 'array|nullable',
            'messengers.*.messenger_type_id' => 'required|exists:messenger_types,id',
            'messengers.*.info' => 'required|string|max:255',
        ]);

        $contact = new Contact();

        DB::transaction(function () use ($contact, $request) {
            $user = Auth::user();

            $contact->fill($request->all());
            $contact->team_id = $user->team->id;
            $contact->created_by = $user->id;
            $contact->updated_by = $user->id;
            $contact->save();

            //COMPANIES & JOB TITLES START
            $companies = array();
            foreach (collect($request->companies) as $company) {
                $companies[$company['id']] = ['job_title' => $company['pivot']['job_title']];
            }
            $contact->companies()->sync($companies);
            //COMPANIES & JOB TITLES END

            $newPhones = collect($request->phones);
            foreach ($newPhones as $phone) {
                if (@$phone['phone_type_id'] || @$phone['info']) {
                    $newPhone = new ContactPhone();
                    $newPhone->phone_type_id = @$phone['phone_type_id'];
                    $newPhone->info = @$phone['info'];
                    $contact->phones()->save($newPhone);
                }
            }

            $newEmails = collect($request->emails);
            foreach ($newEmails as $email) {
                if (@$email['email_type_id'] || @$email['info']) {
                    $newEmail = new ContactEmail();
                    $newEmail->email_type_id = @$email['email_type_id'];
                    $newEmail->info = @$email['info'];
                    $contact->emails()->save($newEmail);
                }
            }

            $newMessengers = collect($request->messengers);
            foreach ($newMessengers as $item) {
                if (@$item['messenger_type_id'] || @$item['info']) {
                    $newMessenger = new ContactMessenger();
                    $newMessenger->messenger_type_id = @$item['messenger_type_id'];
                    $newMessenger->info = @$item['info'];
                    $contact->messengers()->save($newMessenger);
                }
            }
        });

        return response()->json($this->show($contact), 201);
    }

    public function destroy(Request $request, Contact $contact)
    {
        $contact->updated_by = Auth::user()->id;
        $contact->delete();
        return response()->json(null, 204);
    }
}
