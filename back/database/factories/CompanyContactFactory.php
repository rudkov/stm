<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Contact;
use App\Models\Company;
use App\Models\CompanyContact;
use App\Models\Team;
use App\Models\User;

class CompanyContactFactory extends Factory
{
    public function definition()
    {
        return [];
    }

    public function run()
    {
        $companies = Company::all()->groupBy('team_id');
        $contacts = Contact::all();

        foreach ($contacts as $contact) {
            $randomCompanies = $companies[$contact->team_id]->random(rand(0, 2));
            foreach ($randomCompanies as $randomCompany) {
                $contact->companies()->attach($randomCompany, ['job_title' => $this->faker->jobTitle]);
            }
        }
    }
}
