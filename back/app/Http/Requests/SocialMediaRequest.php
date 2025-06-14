<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SocialMediaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id' => 'sometimes|exists:social_media,id',
            'social_media_type_id' => 'required|exists:social_media_types,id',
            'info' => 'required|string|max:255',
        ];
    }
}
