<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => 'sometimes|exists:emails,id',
            'email_type_id' => 'required|exists:email_types,id',
            'info' => 'required|email|max:255',
        ];
    }
}
