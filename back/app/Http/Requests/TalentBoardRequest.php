<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class TalentBoardRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('talent_boards')->where(function ($query) {
                    return $query->where('team_id', Auth::user()->team_id);
                }),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter board name',
            'name.max' => 'Board name is too long – max 255 characters',
            'name.unique' => 'This board name is already taken',
        ];
    }
}
