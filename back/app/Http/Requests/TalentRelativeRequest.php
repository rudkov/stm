<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\TalentRelative;
use App\Models\TalentRelativeType;

class TalentRelativeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(TalentRelative::class, 'id')],
            'type.id' => ['nullable', Rule::exists(TalentRelativeType::class, 'id')],
            'info' => 'required|string|max:255',
        ];
    }
}
