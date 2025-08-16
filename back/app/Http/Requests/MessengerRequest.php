<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\Messenger;
use App\Models\MessengerType;

class MessengerRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(Messenger::class, 'id')],
            'type.id' => ['required', Rule::exists(MessengerType::class, 'id')],
            'info' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'info.max' => 'Account name is too long – max 255 characters',
        ];
    }
}
