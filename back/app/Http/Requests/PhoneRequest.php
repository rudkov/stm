<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\CommunicationType;
use App\Models\Phone;

class PhoneRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(Phone::class, 'id')],
            'communication_type_id' => ['nullable', Rule::exists(CommunicationType::class, 'id')],
            'info' => 'required|string|max:255',
        ];
    }
}
