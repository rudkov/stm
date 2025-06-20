<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Helpers\CommunicationTypeHelper;

class CommunicationTypeCollectionRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [];

        foreach (CommunicationTypeHelper::getTypeMapping() as $requestKey => $dbType) {
            $rules[$requestKey] = 'sometimes|array|nullable';
            $rules["{$requestKey}.*.id"] = [
                'sometimes',
                'integer',
                Rule::exists('communication_types', 'id')
                    ->where('team_id', Auth::user()->team_id)
                    ->where('type', $dbType),
            ];
            $rules["{$requestKey}.*.name"] = 'required|string|max:255';
            $rules["{$requestKey}.*.weight"] = 'sometimes|integer';
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

            foreach (CommunicationTypeHelper::getTypeMapping() as $requestKey => $dbType) {
                if (!isset($validated[$requestKey]) || $validated[$requestKey] === null) {
                    continue;
                }

                $types = $validated[$requestKey];
                $names = [];

                // Check for duplicate names within the current request
                foreach ($types as $index => $typeData) {
                    $name = $typeData['name'];

                    if (in_array($name, $names)) {
                        $validator->errors()->add("{$requestKey}.{$index}.name", 'Duplicate names are not allowed within the same request.');
                    } else {
                        $names[] = $name;
                    }
                }
            }
        });
    }
}
