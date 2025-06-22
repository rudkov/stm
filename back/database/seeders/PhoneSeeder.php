<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\CommunicationType;
use App\Models\Contact;
use App\Models\Talent;

class PhoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $phoneTypes = CommunicationType::where('type', 'phone')
            ->orderBy('weight')
            ->get()
            ->groupBy('team_id');

        $contacts = Contact::all();
        $talents = Talent::all();

        foreach ($contacts as $contact) {
            $randomPhoneTypes = $phoneTypes[$contact->team_id]->random(rand(1, count($phoneTypes[$contact->team_id])));

            foreach ($randomPhoneTypes as $randomPhoneType) {
                $contact->phones()->create([
                    'info' => fake()->e164PhoneNumber,
                    'communication_type_id' => $randomPhoneType->id,
                    'phoneable_type' => $contact::class,
                    'phoneable_id' => $contact->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomPhoneTypes = $phoneTypes[$talent->team_id]->random(rand(1, count($phoneTypes[$talent->team_id])));

            foreach ($randomPhoneTypes as $randomPhoneType) {
                $talent->phones()->create([
                    'info' => fake()->e164PhoneNumber,
                    'communication_type_id' => $randomPhoneType->id,
                    'phoneable_type' => $talent::class,
                    'phoneable_id' => $talent->id,
                ]);
            }
        }
    }
}
