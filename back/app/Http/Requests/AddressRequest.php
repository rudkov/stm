<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => 'sometimes|exists:addresses,id',
            'address_type_id' => 'required|exists:address_types,id',
            'info' => 'required|string|max:255',
        ];
    }
}
