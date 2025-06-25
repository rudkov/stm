<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\SocialMedia;
use App\Models\SocialMediaType;

class SocialMediaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => ['sometimes', Rule::exists(SocialMedia::class, 'id')],
            'social_media_type_id' => ['required_with:info', Rule::exists(SocialMediaType::class, 'id')],
            'info' => 'required_with:social_media_type_id|string|max:255',
        ];
    }
}
