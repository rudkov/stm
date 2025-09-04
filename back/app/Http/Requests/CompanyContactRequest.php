<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use App\Models\Company;
use App\Models\Contact;

class CompanyContactRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => [
                'required',
                'uuid',
                function ($attribute, $value, $fail) {
                    $isCompany = Company::whereKey($value)->exists();
                    $isContact = Contact::whereKey($value)->exists();

                    if (!$isCompany && !$isContact) {
                        $fail('The selected id is invalid.');
                    }
                },
            ],
            'job_title' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'This field is required',
            'job_title.max' => 'Job title is too long – max 255 characters',
        ];
    }
}
