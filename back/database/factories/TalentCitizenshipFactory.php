<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Talent;
use App\Models\Country;

class TalentCitizenshipFactory extends Factory
{
    public function definition()
    {
        return [
            //
        ];
    }

    public function run()
    {
        $talents = Talent::all();
        $citizenships = Country::all();

        foreach($talents as $talent) {
            $randomCitizenships = $citizenships->random(rand(1,3));

            foreach($randomCitizenships as $randomCitizenship) {
                $talent->citizenships()->save($randomCitizenship);
            }
        }
    }
}
