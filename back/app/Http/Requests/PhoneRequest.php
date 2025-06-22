<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PhoneRequest extends FormRequest
{
    public function rules()
    {
        return [
            'id' => 'sometimes|exists:phones,id',
            'communication_type_id' => 'nullable|exists:communication_types,id',
            'info' => 'required|string|max:255',
        ];
    }
}
