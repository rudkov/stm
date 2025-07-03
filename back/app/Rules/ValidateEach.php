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

    public function validate($attribute, $value, $fail): void
    {
        if (!is_array($value)) {
            $fail('The :attribute must be an array.');
            return;
        }

        foreach ($value as $index => $item) {
            $request = new $this->requestClass();
            $request->merge($item);
            
            // Create a validator using the request's rules
            $validator = Validator::make($item, $request->rules());
            
            if ($validator->fails()) {
                foreach ($validator->errors()->all() as $error) {
                    $fail("The :attribute.$index $error");
                }
            }
        }
    }

    public function setValidator($validator): void
    {
        $this->validator = $validator;
    }
}
