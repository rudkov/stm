<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Contact;
use App\Models\ContactMessenger;
use App\Models\MessengerType;

class ContactMessengerFactory extends Factory
{
    public function definition()
    {
        return [];
    }

    public function run()
    {
        $contacts = Contact::all();
        $messengerTypes = MessengerType::all();

        foreach ($contacts as $contact) {
            $randomMessengerTypes = $messengerTypes->random(rand(1, 3));

            foreach ($randomMessengerTypes as $randomMessengerType) {
                $contact->messengers()->saveMany([
                    new ContactMessenger([
                        'info' => $this->faker->userName,
                        'messenger_type_id' => $randomMessengerType->id,
                    ]),
                ]);
            }
        }
    }
}
