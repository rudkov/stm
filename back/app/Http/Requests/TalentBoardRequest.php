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
}
