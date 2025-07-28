<?php

namespace App\Queries;

use App\Models\User;
use App\Models\Contact;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class ContactQuery
{
    protected Builder $query;
    protected array $simpleFilters;
    protected array $rangeFilters;

    public function __construct(User $user)
    {
        $this->query = DB::table('contacts')
            ->where('contacts.team_id', $user->team_id)
            ->whereNull('contacts.deleted_at');

        $this->simpleFilters = [];

        $this->rangeFilters = [];
    }

    public function applyFilters(array $request): self
    {
        // Apply simple filters
        foreach ($this->simpleFilters as $column => $param) {
            if (!empty($request[$param])) {
                $this->query->whereIn("contacts.$column", $request[$param]);
            }
        }

        // Apply range filters
        foreach ($this->rangeFilters as $column => $param) {
            if (!empty($request[$param]) && count($request[$param]) === 2) {
                $this->query->whereBetween("contacts.$column", $request[$param]);
            }
        }

        // Apply no contacts filter
        if (isset($request['noContacts']) && ($request['noContacts'] === true || $request['noContacts'] === 'true')) {
            $this->query->whereNotExists(function ($sub) {
                $sub->select(DB::raw(1))
                    ->from('emails')
                    ->whereColumn('emails.emailable_id', 'contacts.id')
                    ->where('emails.emailable_type', Contact::class);
            })->whereNotExists(function ($sub) {
                $sub->select(DB::raw(1))
                    ->from('messengers')
                    ->whereColumn('messengers.messengerable_id', 'contacts.id')
                    ->where('messengers.messengerable_type', Contact::class);
            })->whereNotExists(function ($sub) {
                $sub->select(DB::raw(1))
                    ->from('phones')
                    ->whereColumn('phones.phoneable_id', 'contacts.id')
                    ->where('phones.phoneable_type', Contact::class);
            });
        }

        return $this;
    }

    public function get()
    {
        return $this->query
            ->orderBy('contacts.first_name')
            ->orderBy('contacts.last_name')
            ->get([
                'contacts.id',
                'contacts.first_name',
                'contacts.last_name',
            ]);
    }
}
