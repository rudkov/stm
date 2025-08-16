<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TalentLocationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'location' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'location.max' => 'Location is too long – max 255 characters',
        ];
    }
}
