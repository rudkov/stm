<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\CompanyRequest;
use App\Http\Requests\CompanySearchRequest;
use App\Http\Resources\CompanyCollection;
use App\Models\Company;
use App\Queries\CompanyQuery;

use function App\Helpers\sync_relation;

class CompanyController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Company::class);
    }

    private function sync_relations(Company $company, array $validated)
    {
        sync_relation($company->addresses(), $validated['addresses'] ?? null, ['communication_type_id' => 'type.id', 'info']);
        sync_relation($company->contacts(), $validated['contacts'] ?? null, ['job_title']);
        sync_relation($company->emails(), $validated['emails'] ?? null, ['communication_type_id' => 'type.id', 'info']);
        sync_relation($company->messengers(), $validated['messengers'] ?? null, ['messenger_type_id' => 'type.id', 'info']);
        sync_relation($company->phones(), $validated['phones'] ?? null, ['communication_type_id' => 'type.id', 'info']);
        sync_relation($company->socialMedias(), $validated['social_medias'] ?? null, ['social_media_type_id' => 'type.id', 'info']);
        sync_relation($company->weblinks(), $validated['weblinks'] ?? null, ['info']);
    }

    public function index()
    {
        $companies = Company::where('team_id', Auth::user()->team->id)
            ->orderBy('name', 'asc')
            ->get();

        return new CompanyCollection($companies);
    }

    public function search(CompanySearchRequest $request)
    {
        $this->authorize('viewAny', Company::class);

        $filters = $request->validated();

        $query = new CompanyQuery(Auth::user());
        $companies = $query->applyFilters($filters)->get();
        return new CompanyCollection($companies);
    }

    public function show(Company $company)
    {
        $company->load(
            'addresses',
            'addresses.type',
            'contacts',
            'contacts.addresses',
            'contacts.addresses.type',
            'contacts.companies',
            'contacts.emails',
            'contacts.emails.type',
            'contacts.messengers',
            'contacts.messengers.type',
            'contacts.phones',
            'contacts.phones.type',
            'contacts.socialMedias',
            'contacts.socialMedias.type',
            'contacts.weblinks',
            'emails',
            'emails.type',
            'manager',
            'messengers',
            'messengers.type',
            'phones',
            'phones.type',
            'socialMedias',
            'socialMedias.type',
            'weblinks',
            'createdBy',
            'updatedBy'
        );
        return $company->toResource();
    }

    public function update(CompanyRequest $request, Company $company)
    {
        $validated = $request->validated();
        DB::transaction(function () use ($company, $validated) {
            $company->update($validated);

            $this->sync_relations($company, $validated);
        });

        return $this->show($company);
    }

    public function store(CompanyRequest $request)
    {
        $company = new Company();
        $validated = $request->validated();

        DB::transaction(function () use ($company, $validated) {
            $company->fill($validated);
            $company->team_id = Auth::user()->team_id;
            $company->save();

            $this->sync_relations($company, $validated);
        });

        return $this->show($company);
    }

    public function destroy(Company $company)
    {
        $company->delete();
        return response()->json(null, 204);
    }

    public function managers()
    {
        $this->authorize('viewAny', Company::class);

        $uniqueManagers = DB::table('companies')
            ->leftJoin('users', 'companies.manager_id', '=', 'users.id')
            ->where('companies.team_id', Auth::user()->team_id)
            ->whereNull('companies.deleted_at')
            ->distinct()
            ->orderBy('users.name')
            ->get(['users.id', 'users.name']);
        return $uniqueManagers;
    }
}
