<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\ValidateEach;

class ContactRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => 'required_without:last_name|string|max:255',
            'last_name' => 'required_without:first_name|string|max:255',
            'comment' => 'nullable|string',

            'companies' => ['nullable', 'array', new ValidateEach(new CompanyContactRequest())],
            'emails' => ['nullable', 'array', new ValidateEach(new EmailRequest())],
            'messengers' => ['nullable', 'array', new ValidateEach(new MessengerRequest())],
            'phones' => ['nullable', 'array', new ValidateEach(new PhoneRequest())],
        ];
    }
}
