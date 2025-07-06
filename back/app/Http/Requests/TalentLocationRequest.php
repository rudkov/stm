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
}
