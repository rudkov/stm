<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'comment' => 'nullable|string',
            'companies' => 'array|nullable',
            'companies.*.id' => 'required|exists:companies,id',
            'companies.*.job_title' => 'nullable|string|max:255',
            'phones' => 'array|nullable',
            'phones.*.id' => 'sometimes|exists:phones,id',
            'phones.*.phone_type_id' => 'required|exists:phone_types,id',
            'phones.*.info' => 'required|string|max:255',
            'emails' => 'array|nullable',
            'emails.*.id' => 'sometimes|exists:emails,id',
            'emails.*.email_type_id' => 'required|exists:email_types,id',
            'emails.*.info' => 'required|email|max:255',
            'messengers' => 'array|nullable',
            'messengers.*.id' => 'sometimes|exists:messengers,id',
            'messengers.*.messenger_type_id' => 'required|exists:messenger_types,id',
            'messengers.*.info' => 'required|string|max:255',
        ];
    }
}
