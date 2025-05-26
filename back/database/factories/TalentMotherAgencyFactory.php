<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Talent;

class TalentMotherAgencyFactory extends Factory
{
    public function definition(): array
    {
        return [
            //
        ];
    }

    public function run()
    {
        $talents = Talent::all();
        $companies = Company::all()->groupBy('team_id');
        $contacts = Contact::all()->groupBy('team_id');

        foreach ($talents as $talent) {
            $motherAgency = collect([
                $companies[$talent->team_id]->random(),
                $contacts[$talent->team_id]->random()
            ])->random();
            $talent->motherAgency()->associate($motherAgency);
            $talent->save();
        }
    }
}
