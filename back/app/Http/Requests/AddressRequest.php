<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

use App\Models\Address;
use App\Models\CommunicationType;

class AddressRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['sometimes', Rule::exists(Address::class, 'id')],
            'communication_type_id' => [
                'nullable', 
                Rule::exists(CommunicationType::class, 'id')->where('team_id', Auth::user()->team_id)
            ],
            'info' => 'required|string|max:255',
        ];
    }
}
