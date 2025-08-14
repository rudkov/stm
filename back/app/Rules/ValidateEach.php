<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Support\Facades\Validator;

class ValidateEach implements ValidationRule, ValidatorAwareRule
{
    protected $requestClass;
    protected $validator;

    public function __construct($requestClass)
    {
        $this->requestClass = $requestClass;
    }

    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        if (!is_array($value)) {
            $fail('The :attribute must be an array.');
            return;
        }

        foreach ($value as $index => $item) {
            if (!is_array($item)) {
                $this->validator->errors()->add("{$attribute}.{$index}", "The {$attribute}.{$index} must be an object.");
                continue;
            }

            $request = new $this->requestClass();
            $itemValidator = Validator::make($item, $request->rules());

            if ($itemValidator->fails()) {
                foreach ($itemValidator->errors()->messages() as $field => $messages) {
                    foreach ($messages as $message) {
                        $this->validator->errors()->add("{$attribute}.{$index}.{$field}", $message);
                    }
                }
            }
        }
    }

    public function setValidator($validator): void
    {
        $this->validator = $validator;
    }
}
