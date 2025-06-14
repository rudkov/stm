<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PhoneRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => 'sometimes|exists:phones,id',
            'phone_type_id' => 'required|exists:phone_types,id',
            'info' => 'required|string|max:255',
        ];
    }
}
