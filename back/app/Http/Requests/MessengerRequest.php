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
            'messenger_type_id' => 'required_with:info|exists:messenger_types,id',
            'info' => 'required_with:messenger_type_id|string|max:255',
        ];
    }
}
