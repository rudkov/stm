<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MessengerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => 'sometimes|exists:messengers,id',
            'messenger_type_id' => 'required|exists:messenger_types,id',
            'info' => 'required|string|max:255',
        ];
    }
}
