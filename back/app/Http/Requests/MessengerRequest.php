<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\Messenger;
use App\Models\MessengerType;

class MessengerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => ['sometimes', Rule::exists(Messenger::class, 'id')],
            'messenger_type_id' => ['required_with:info', Rule::exists(MessengerType::class, 'id')],
            'info' => 'required_with:messenger_type_id|string|max:255',
        ];
    }
}
