<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\CommunicationType;
use App\Models\Email;

class EmailRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(Email::class, 'id')],
            'communication_type_id' => ['nullable', Rule::exists(CommunicationType::class, 'id')],
            'info' => 'required|email|max:255',
        ];
    }
}
