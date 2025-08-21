<?php

namespace App\Queries;

use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

use function App\Helpers\apply_simple_filters;
use function App\Helpers\apply_range_filters;
use function App\Helpers\apply_missing_morph_many_relationship_filters;

class CompanyQuery
{
    protected Builder $query;
    protected array $simpleFilters;
    protected array $rangeFilters;
    protected array $relationshipFilters;

    public function __construct(User $user)
    {
        $this->query = DB::table('companies')
            ->where('companies.team_id', $user->team_id)
            ->whereNull('companies.deleted_at');

        $this->simpleFilters = [];

        $this->rangeFilters = [];

        $this->relationshipFilters = [
            'noContacts' => ['emails', 'messengers', 'phones'],
        ];
    }

    public function applyFilters(array $request): self
    {
        apply_simple_filters($this->query, Company::class, $request, $this->simpleFilters);
        apply_range_filters($this->query, Company::class, $request, $this->rangeFilters);
        apply_missing_morph_many_relationship_filters($this->query, Company::class, $request, $this->relationshipFilters);

        return $this;
    }

    public function get()
    {
        return $this->query
            ->orderBy('companies.name')
            ->get([
                'companies.id',
                'companies.name',
                'companies.manager_id',
            ]);
    }
}
