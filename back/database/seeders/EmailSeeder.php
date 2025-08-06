<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\CommunicationType;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Talent;

class EmailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $emailTypes = CommunicationType::where('type', 'email')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('team_id');

        $companies = Company::all();
        $contacts = Contact::all();
        $talents = Talent::all();

        foreach ($companies as $company) {
            $randomEmailTypes = $emailTypes[$company->team_id]->random(rand(1, count($emailTypes[$company->team_id])));

            foreach ($randomEmailTypes as $randomEmailType) {
                $company->emails()->create([
                    'info' => fake()->email,
                    'communication_type_id' => $randomEmailType->id,
                ]);
            }
        }

        foreach ($contacts as $contact) {
            $randomEmailTypes = $emailTypes[$contact->team_id]->random(rand(1, count($emailTypes[$contact->team_id])));

            foreach ($randomEmailTypes as $randomEmailType) {
                $contact->emails()->create([
                    'info' => fake()->email,
                    'communication_type_id' => $randomEmailType->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomEmailTypes = $emailTypes[$talent->team_id]->random(rand(1, count($emailTypes[$talent->team_id])));

            foreach ($randomEmailTypes as $randomEmailType) {
                $talent->emails()->create([
                    'info' => fake()->email,
                    'communication_type_id' => $randomEmailType->id,
                ]);
            }
        }
    }
}
