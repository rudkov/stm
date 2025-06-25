<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

use App\Helpers\CommunicationTypeHelper;

use App\Models\CommunicationType;


class CommunicationTypeCollectionRequest extends FormRequest
{
    public function rules(): array
    {
        $rules = [];

        foreach (CommunicationTypeHelper::getTypes() as $type) {
            $rules[$type] = 'sometimes|array|nullable';
            $rules["{$type}.*.id"] = [
                'sometimes',
                'integer',
                Rule::exists(CommunicationType::class, 'id')
                    ->where('team_id', Auth::user()->team_id)
                    ->where('type', $type),
            ];
            $rules["{$type}.*.name"] = 'required|string|max:255';
        }

        return $rules;
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $validated = $this->validated();

            foreach (CommunicationTypeHelper::getTypes() as $type) {
                if (!isset($validated[$type]) || $validated[$type] === null) {
                    continue;
                }

                $types = $validated[$type];
                $names = [];

                // Check for duplicate names within the current request
                foreach ($types as $index => $typeData) {
                    $name = $typeData['name'];

                    if (in_array($name, $names)) {
                        $validator->errors()->add("{$type}.{$index}.name", 'Duplicate names are not allowed within the same request.');
                    } else {
                        $names[] = $name;
                    }
                }
            }
        });
    }
}
