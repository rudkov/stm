<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\MessengerType;

use App\Models\Contact;
use App\Models\Talent;

class MessengerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $messengerTypes = MessengerType::all();

        $contacts = Contact::all();
        $talents = Talent::all();

        foreach ($contacts as $contact) {
            $randomMessengerTypes = $messengerTypes->random(rand(1, count($messengerTypes)));

            foreach ($randomMessengerTypes as $randomMessengerType) {
                $contact->messengers()->create([
                    'info' => fake()->userName,
                    'messenger_type_id' => $randomMessengerType->id,
                    'messengerable_type' => $contact::class,
                    'messengerable_id' => $contact->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomMessengerTypes = $messengerTypes->random(rand(1, count($messengerTypes)));

            foreach ($randomMessengerTypes as $randomMessengerType) {
                $talent->messengers()->create([
                    'info' => fake()->userName,
                    'messenger_type_id' => $randomMessengerType->id,
                    'messengerable_type' => $talent::class,
                    'messengerable_id' => $talent->id,
                ]);
            }
        }
    }
}
