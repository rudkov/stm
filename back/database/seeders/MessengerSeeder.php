<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\MessengerType;

use App\Models\Company;
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

        $companies = Company::all();
        $contacts = Contact::all();
        $talents = Talent::all();

        foreach ($companies as $company) {
            $randomMessengerTypes = $messengerTypes->random(rand(1, count($messengerTypes)));

            foreach ($randomMessengerTypes as $randomMessengerType) {
                $company->messengers()->create([
                    'info' => fake()->userName,
                    'messenger_type_id' => $randomMessengerType->id,
                ]);
            }
        }

        foreach ($contacts as $contact) {
            $randomMessengerTypes = $messengerTypes->random(rand(1, count($messengerTypes)));

            foreach ($randomMessengerTypes as $randomMessengerType) {
                $contact->messengers()->create([
                    'info' => fake()->userName,
                    'messenger_type_id' => $randomMessengerType->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomMessengerTypes = $messengerTypes->random(rand(1, count($messengerTypes)));

            foreach ($randomMessengerTypes as $randomMessengerType) {
                $talent->messengers()->create([
                    'info' => fake()->userName,
                    'messenger_type_id' => $randomMessengerType->id,
                ]);
            }
        }
    }
}
