<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\Country;

class CountryRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'alpha_2' => ['required', Rule::exists(Country::class, 'alpha_2')],
        ];
    }
}
