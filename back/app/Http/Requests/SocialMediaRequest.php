<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\SocialMedia;
use App\Models\SocialMediaType;

class SocialMediaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(SocialMedia::class, 'id')],
            'type.id' => ['required', Rule::exists(SocialMediaType::class, 'id')],
            'info' => 'required|string|max:255',
        ];
    }
}
