<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Contact;
use App\Models\ContactPhone;
use App\Models\PhoneType;

class ContactPhoneFactory extends Factory
{
    public function definition()
    {
        return [];
    }

    public function run()
    {
        $contacts = Contact::all();
        $phoneTypes = PhoneType::all();

        foreach ($contacts as $contact) {
            $randomPhoneTypes = $phoneTypes->random(rand(1, 3));

            foreach ($randomPhoneTypes as $randomPhoneType) {
                $contact->phones()->saveMany([
                    new ContactPhone([
                        'info' => $this->faker->e164PhoneNumber,
                        'phone_type_id' => $randomPhoneType->id,
                    ]),
                ]);
            }
        }
    }
}
