<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\TalentEmergencyContact;

class TalentEmergencyContactRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(TalentEmergencyContact::class, 'id')],
            'info' => 'required|string',
        ];
    }
}
