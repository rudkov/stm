<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

use App\Models\CommunicationType;

class CommunicationTypeCollectionRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [];

        foreach (CommunicationType::getDefaultTypes() as $type) {
            $rules[$type] = 'sometimes|array|nullable';
            $rules["{$type}.*.id"] = [
                'sometimes',
                'integer',
                Rule::exists('communication_types', 'id')
                    ->where('team_id', Auth::user()->team_id)
                    ->where('type', $type),
            ];
            $rules["{$type}.*.name"] = 'required|string|max:255';
        }

        return $rules;
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $validated = $this->validated();

            foreach (CommunicationType::getDefaultTypes() as $type) {
                if (!isset($validated[$type]) || $validated[$type] === null) {
                    continue;
                }

                $types = $validated[$type];
                $seen = [];

                // Check for duplicate names within the current request
                foreach ($types as $index => ['name' => $name]) {
                    if (isset($seen[$name])) {
                        $validator->errors()->add("{$type}.{$index}.name", 'Duplicate names are not allowed within the same request.');
                    } else {
                        $seen[$name] = true;
                    }
                }
            }
        });
    }
}
