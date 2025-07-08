<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Talent;

class WeblinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();
        $contacts = Contact::all();
        $talents = Talent::all();

        foreach ($companies as $company) {
            $randomNumberOfWeblinks = rand(0, 2);

            for ($i = 0; $i < $randomNumberOfWeblinks; $i++) {
                $company->weblinks()->create([
                    'info' => fake()->url,
                ]);
            }
        }

        foreach ($contacts as $contact) {
            $randomNumberOfWeblinks = rand(0, 2);

            for ($i = 0; $i < $randomNumberOfWeblinks; $i++) {
                $contact->weblinks()->create([
                    'info' => fake()->url,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomNumberOfWeblinks = rand(0, 2);

            for ($i = 0; $i < $randomNumberOfWeblinks; $i++) {
                $talent->weblinks()->create([
                    'info' => fake()->url,
                ]);
            }
        }
    }
}
