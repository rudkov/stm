<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Talent;
use App\Models\TalentEmail;
use App\Models\EmailType;

class TalentEmailFactory extends Factory
{
    public function definition()
    {
        return [];
    }

    public function run()
    {
        $talents = Talent::all();
        $emailTypes = EmailType::all();

        foreach ($talents as $talent) {
            $randomEmailTypes = $emailTypes->random(rand(1, 3));

            foreach ($randomEmailTypes as $randomEmailType) {
                $talent->emails()->saveMany([
                    new TalentEmail([
                        'info' => $this->faker->email,
                        'email_type_id' => $randomEmailType->id,
                    ]),
                ]);
            }
        }
    }
}
