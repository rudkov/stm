<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\Language;

class LanguageRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['required', Rule::exists(Language::class, 'id')],
        ];
    }
}
