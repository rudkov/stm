<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailRequest extends FormRequest
{
    public function rules()
    {
        return [
            'id' => 'sometimes|exists:emails,id',
            'communication_type_id' => 'nullable|exists:communication_types,id',
            'info' => 'required|email|max:255',
        ];
    }
}
