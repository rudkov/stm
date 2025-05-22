<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Talent;
use App\Models\TalentMessenger;
use App\Models\MessengerType;

class TalentMessengerFactory extends Factory
{
    public function definition()
    {
        return [];
    }

    public function run()
    {
        $talents = Talent::all();
        $messengerTypes = MessengerType::all();

        foreach ($talents as $talent) {
            $randomMessengerTypes = $messengerTypes->random(rand(1, 4));

            foreach ($randomMessengerTypes as $randomMessengerType) {
                $talent->messengers()->saveMany([
                    new TalentMessenger([
                        'info' => $this->faker->userName,
                        'messenger_type_id' => $randomMessengerType->id,
                    ]),
                ]);
            }
        }
    }
}
