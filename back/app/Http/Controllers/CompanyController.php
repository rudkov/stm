<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Http\Requests\CompanyRequest;
use App\Http\Resources\CompanyCollection;
use Illuminate\Support\Facades\Auth;

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
            'contacts',
            'createdBy',
            'updatedBy'
        );
        return $company->toResource();
    }

    public function update(CompanyRequest $request, Company $company)
    {
        $validated = $request->validated();
        $company->updated_by = Auth::user()->id;
        $company->update($validated);

        return $this->show($company);
    }

    public function store(CompanyRequest $request)
    {
        $company = new Company();
        $user = Auth::user();
        $validated = $request->validated();

        $company->fill($validated);
        $company->team_id = $user->team->id;
        $company->created_by = $user->id;
        $company->updated_by = $user->id;
        $company->save();

        return $this->show($company);
    }

    public function destroy(Company $company)
    {
        $company->updated_by = Auth::user()->id;
        $company->delete();
        return response()->json(null, 204);
    }
}
