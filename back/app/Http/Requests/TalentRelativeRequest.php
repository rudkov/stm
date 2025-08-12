<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\TalentRelative;

class TalentRelativeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(TalentRelative::class, 'id')],
            'info' => 'required|string|max:255',
        ];
    }
}
