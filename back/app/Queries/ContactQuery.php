<?php

namespace App\Queries;

use App\Models\User;
use App\Models\Contact;
use App\Models\Email;
use App\Models\Messenger;
use App\Models\Phone;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

use function App\Helpers\apply_simple_filters;
use function App\Helpers\apply_range_filters;
use function App\Helpers\apply_no_contacts_filter;

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
        apply_simple_filters($this->query, Contact::class, $request, $this->simpleFilters);
        apply_range_filters($this->query, Contact::class, $request, $this->rangeFilters);
        apply_no_contacts_filter($this->query, Contact::class, $request, [Email::class, Messenger::class, Phone::class]);

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
