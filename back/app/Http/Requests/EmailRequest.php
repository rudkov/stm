<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

use App\Models\CommunicationType;
use App\Models\Email;

class EmailRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(Email::class, 'id')],
            'communication_type_id' => [
                'nullable',
                Rule::exists(CommunicationType::class, 'id')->where('team_id', Auth::user()->team_id)
            ],
            'info' => 'required|email|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'info.email' => 'Email format is wrong',
            'info.max' => 'Email is too long – max 255 characters',
        ];
    }
}
