<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class TeamRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter team name',
            'name.max' => 'Team name is too long – max 255 characters',
        ];
    }
}
