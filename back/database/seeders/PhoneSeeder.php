<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\PhoneType;

use App\Models\Contact;
use App\Models\Talent;

class PhoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $phoneTypes = PhoneType::all();

        $contacts = Contact::all();
        $talents = Talent::all();

        foreach ($contacts as $contact) {
            $randomPhoneTypes = $phoneTypes->random(rand(1, count($phoneTypes)));

            foreach ($randomPhoneTypes as $randomPhoneType) {
                $contact->phones()->create([
                    'info' => fake()->e164PhoneNumber,
                    'phone_type_id' => $randomPhoneType->id,
                    'phoneable_type' => $contact::class,
                    'phoneable_id' => $contact->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomPhoneTypes = $phoneTypes->random(rand(1, count($phoneTypes)));

            foreach ($randomPhoneTypes as $randomPhoneType) {
                $talent->phones()->create([
                    'info' => fake()->e164PhoneNumber,
                    'phone_type_id' => $randomPhoneType->id,
                    'phoneable_type' => $talent::class,
                    'phoneable_id' => $talent->id,
                ]);
            }
        }
    }
}
