<?php

namespace App\Queries;

use App\Models\User;
use App\Models\Contact;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

use function App\Helpers\apply_simple_filters;
use function App\Helpers\apply_range_filters;
use function App\Helpers\apply_missing_morph_many_relationship_filters;

class ContactQuery
{
    protected Builder $query;
    protected array $simpleFilters;
    protected array $rangeFilters;
    protected array $relationshipFilters;

    public function __construct(User $user)
    {
        $this->query = DB::table('contacts')
            ->where('contacts.team_id', $user->team_id)
            ->whereNull('contacts.deleted_at');

        $this->simpleFilters = [];

        $this->rangeFilters = [];

        $this->relationshipFilters = [
            'noContacts' => ['emails', 'messengers', 'phones'],
        ];
    }

    public function applyFilters(array $request): self
    {
        apply_simple_filters($this->query, Contact::class, $request, $this->simpleFilters);
        apply_range_filters($this->query, Contact::class, $request, $this->rangeFilters);
        apply_missing_morph_many_relationship_filters($this->query, Contact::class, $request, $this->relationshipFilters);

        return $this;
    }

    public function get()
    {
        $contacts = $this->query
            ->orderBy('contacts.first_name')
            ->orderBy('contacts.last_name')
            ->get([
                'contacts.id',
                'contacts.first_name',
                'contacts.last_name',
                'contacts.job_title',
            ]);

        if ($contacts->isEmpty()) {
            return $contacts;
        }

        // Fetch all companies for the retrieved contacts in a single query
        $companyRows = DB::table('company_contact')
            ->join('companies', 'companies.id', '=', 'company_contact.company_id')
            ->whereIn('company_contact.contact_id', $contacts->pluck('id'))
            ->orderBy('companies.name')
            ->select([
                'company_contact.contact_id',
                'companies.id as company_id',
                'companies.name as company_name',
                'company_contact.job_title',
            ])
            ->get();

        // Group companies by contact
        $companiesByContact = $companyRows->groupBy('contact_id');

        return $contacts->map(function ($contact) use ($companiesByContact) {
            $companies = $companiesByContact->get($contact->id, collect())->map(function ($row) {
                return [
                    'name'      => $row->company_name,
                    'job_title' => $row->job_title,
                ];
            })->values();

            $obj = new \stdClass();
            $obj->id = $contact->id;
            $obj->first_name = $contact->first_name;
            $obj->last_name = $contact->last_name;
            $obj->job_title = $contact->job_title;
            $obj->companies = $companies;
            return $obj;
        });
    }
}
