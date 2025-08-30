<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use App\Rules\ValidateEach;

class CompanyRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'notes' => 'nullable|string',

            // Collections - Morph-many relationships (complex objects)
            'addresses' => ['nullable', 'array', new ValidateEach(new AddressRequest())],
            'emails' => ['nullable', 'array', new ValidateEach(new EmailRequest())],
            'messengers' => ['nullable', 'array', new ValidateEach(new MessengerRequest())],
            'phones' => ['nullable', 'array', new ValidateEach(new PhoneRequest())],
            'social_medias' => ['nullable', 'array', new ValidateEach(new SocialMediaRequest())],
            'weblinks' => ['nullable', 'array', new ValidateEach(new WeblinkRequest())],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter company name',
            'name.max' => 'Company name is too long – max 255 characters',
        ];
    }
}
