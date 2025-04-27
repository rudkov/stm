<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Talent;
use App\Models\TalentPhone;
use App\Models\PhoneType;

class TalentPhoneFactory extends Factory
{
    public function definition()
    {
        return [];
    }

    public function run()
    {
        $talents = Talent::all();
        $phoneTypes = PhoneType::all();

        foreach ($talents as $talent) {
            $randomPhoneTypes = $phoneTypes->random(rand(1, 3));

            foreach ($randomPhoneTypes as $randomPhoneType) {
                $talent->phones()->saveMany([
                    new TalentPhone([
                        'info' => $this->faker->e164PhoneNumber,
                        'phone_type_id' => $randomPhoneType->id,
                    ]),
                ]);
            }
        }
    }
}
