<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Company;
use App\Models\Contact;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contacts = $this->createContacts();
        $this->createContactCompanyRelationships($contacts);
    }

    /**
     * Create contacts using factory.
     */
    private function createContacts()
    {
        return Contact::factory(50)->create();
    }

    /**
     * Create relationships between contacts and companies.
     */
    private function createContactCompanyRelationships($contacts): void
    {
        $companies = Company::all()->groupBy('team_id');

        foreach ($contacts as $contact) {
            $randomCompanies = $companies[$contact->team_id]->random(rand(0, 2));
            foreach ($randomCompanies as $randomCompany) {
                $contact->companies()->attach($randomCompany, ['job_title' => fake()->jobTitle]);
            }
        }
    }
}
