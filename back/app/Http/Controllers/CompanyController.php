<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\CompanyRequest;
use App\Http\Resources\CompanyCollection;
use App\Models\Company;

use function App\Helpers\sync_relation;

class CompanyController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Company::class);
    }

    public function index()
    {
        $companies = Company::where('team_id', Auth::user()->team->id)
            ->orderBy('name', 'asc')
            ->get();

        return new CompanyCollection($companies);
    }

    public function show(Company $company)
    {
        $company->load(
            'addresses',
            'addresses.type',
            'contacts',
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
            'updatedBy'
        );
        return $company->toResource();
    }

    public function update(CompanyRequest $request, Company $company)
    {
        $validated = $request->validated();
        DB::transaction(function () use ($company, $validated) {
            $company->update($validated);

            sync_relation($company->addresses(), $validated['addresses'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($company->emails(), $validated['emails'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($company->messengers(), $validated['messengers'] ?? [], ['messenger_type_id', 'info']);
            sync_relation($company->phones(), $validated['phones'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($company->socialMedias(), $validated['social_medias'] ?? [], ['social_media_type_id', 'info']);
            sync_relation($company->weblinks(), $validated['weblinks'] ?? [], ['info']);
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

            sync_relation($company->addresses(), $validated['addresses'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($company->emails(), $validated['emails'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($company->messengers(), $validated['messengers'] ?? [], ['messenger_type_id', 'info']);
            sync_relation($company->phones(), $validated['phones'] ?? [], ['communication_type_id' => 'type.id', 'info']);
            sync_relation($company->socialMedias(), $validated['social_medias'] ?? [], ['social_media_type_id', 'info']);
            sync_relation($company->weblinks(), $validated['weblinks'] ?? [], ['info']);
        });

        return $this->show($company);
    }

    public function destroy(Company $company)
    {
        $company->delete();
        return response()->json(null, 204);
    }
}
