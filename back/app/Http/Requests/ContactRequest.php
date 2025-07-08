<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use App\Rules\ValidateEach;

class ContactRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'first_name' => 'required_without:last_name|string|max:255',
            'last_name' => 'required_without:first_name|string|max:255',
            'comment' => 'nullable|string',

            // Collections - Morph-many relationships (complex objects)
            'addresses' => ['nullable', 'array', new ValidateEach(new AddressRequest())],
            'companies' => ['nullable', 'array', new ValidateEach(new CompanyContactRequest())],
            'emails' => ['nullable', 'array', new ValidateEach(new EmailRequest())],
            'messengers' => ['nullable', 'array', new ValidateEach(new MessengerRequest())],
            'phones' => ['nullable', 'array', new ValidateEach(new PhoneRequest())],
            'social_medias' => ['nullable', 'array', new ValidateEach(new SocialMediaRequest())],
            'weblinks' => ['nullable', 'array', new ValidateEach(new WeblinkRequest())],
        ];
    }
}
