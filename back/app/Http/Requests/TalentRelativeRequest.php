<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TalentRelativeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'sometimes|exists:talent_relatives,id',
            'relative_type_id' => 'nullable|exists:talent_relative_types,id',
            'info' => 'required|string|max:255',
        ];
    }
}
