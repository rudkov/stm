<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanySearchRequest extends FormRequest
{
    /**
     * These rules match exactly what the frontend sends via transformFilters()
     */
    public function rules(): array
    {
        return [
            // Search-specific parameters
            'noContacts' => 'nullable|boolean',
        ];
    }
}
