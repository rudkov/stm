<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\CommunicationType;

use App\Models\Company;
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
            ->orderBy('sort_order')
            ->get()
            ->groupBy('team_id');

        $companies = Company::all();
        $contacts = Contact::all();
        $talents = Talent::all();

        foreach ($companies as $company) {
            $randomPhoneTypes = $phoneTypes[$company->team_id]->random(rand(1, count($phoneTypes[$company->team_id])));

            foreach ($randomPhoneTypes as $randomPhoneType) {
                $company->phones()->create([
                    'info' => fake()->e164PhoneNumber,
                    'communication_type_id' => $randomPhoneType->id,
                ]);
            }
        }

        foreach ($contacts as $contact) {
            $randomPhoneTypes = $phoneTypes[$contact->team_id]->random(rand(1, count($phoneTypes[$contact->team_id])));

            foreach ($randomPhoneTypes as $randomPhoneType) {
                $contact->phones()->create([
                    'info' => fake()->e164PhoneNumber,
                    'communication_type_id' => $randomPhoneType->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomPhoneTypes = $phoneTypes[$talent->team_id]->random(rand(1, count($phoneTypes[$talent->team_id])));

            foreach ($randomPhoneTypes as $randomPhoneType) {
                $talent->phones()->create([
                    'info' => fake()->e164PhoneNumber,
                    'communication_type_id' => $randomPhoneType->id,
                ]);
            }
        }
    }
}
