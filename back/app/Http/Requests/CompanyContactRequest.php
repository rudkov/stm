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

    public function messages(): array
    {
        return [
            'job_title.max' => 'Job title is too long – max 255 characters',
        ];
    }
}
