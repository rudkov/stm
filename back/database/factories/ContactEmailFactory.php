<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Contact;
use App\Models\EmailType;

class ContactEmailFactory extends Factory
{
    public function definition()
    {
        return [];
    }

    public function run()
    {
        $contacts = Contact::all();
        $emailTypes = EmailType::all();

        foreach ($contacts as $contact) {
            $randomEmailTypes = $emailTypes->random(rand(1, 3));

            foreach ($randomEmailTypes as $randomEmailType) {
                $contact->emails()->create([
                    'info' => $this->faker->email,
                    'email_type_id' => $randomEmailType->id,
                ]);
            }
        }
    }
}
