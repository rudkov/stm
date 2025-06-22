<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    public function rules()
    {
        return [
            'id' => 'sometimes|exists:addresses,id',
            'communication_type_id' => 'nullable|exists:communication_types,id',
            'info' => 'required|string|max:255',
        ];
    }
}
