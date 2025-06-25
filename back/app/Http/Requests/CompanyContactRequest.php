<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\Company;

class CompanyContactRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['required', Rule::exists(Company::class, 'id')],
            'job_title' => 'nullable|string|max:255',
        ];
    }
}
