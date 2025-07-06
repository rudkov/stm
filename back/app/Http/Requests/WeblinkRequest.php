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
}
