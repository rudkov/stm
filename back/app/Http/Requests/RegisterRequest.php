<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email:rfc|max:255|unique:users',
            'password' => 'required|string|min:8',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your name',
            'name.max' => 'Name is too long – max 255 characters',

            'email.required' => 'Please enter your email address',
            'email.email' => 'Email format is wrong',
            'email.max' => 'Email is too long – max 255 characters',
            'email.unique' => 'This email is already taken',

            'password.required' => 'Please enter your password',
            'password.min' => 'Password should be at least 8 characters',
        ];
    }
}
