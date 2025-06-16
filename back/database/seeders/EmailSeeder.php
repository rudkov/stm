<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\EmailType;

use App\Models\Contact;
use App\Models\Talent;

class EmailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $emailTypes = EmailType::all();

        $contacts = Contact::all();
        $talents = Talent::all();

        foreach ($contacts as $contact) {
            $randomEmailTypes = $emailTypes->random(rand(1, count($emailTypes)));

            foreach ($randomEmailTypes as $randomEmailType) {
                $contact->emails()->create([
                    'info' => fake()->email,
                    'email_type_id' => $randomEmailType->id,
                    'emailable_type' => $contact::class,
                    'emailable_id' => $contact->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomEmailTypes = $emailTypes->random(rand(1, count($emailTypes)));

            foreach ($randomEmailTypes as $randomEmailType) {
                $talent->emails()->create([
                    'info' => fake()->email,
                    'email_type_id' => $randomEmailType->id,
                    'emailable_type' => $talent::class,
                    'emailable_id' => $talent->id,
                ]);
            }
        }
    }
}
