<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\Weblink;

class WeblinkRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(Weblink::class, 'id')],
            'info' => 'required|url|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'info.url' => 'URL format is wrong',
            'info.max' => 'URL is too long – max 255 characters',
        ];
    }
}
