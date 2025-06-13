<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Talent;
use App\Models\Address;
use App\Models\AddressType;

class TalentAddressFactory extends Factory
{
    public function definition()
    {
        return [];
    }

    public function run()
    {
        $talents = Talent::all();
        $addressTypes = AddressType::all();

        foreach ($talents as $talent) {
            $randomAddressTypes = $addressTypes->random(rand(1, 3));

            foreach ($randomAddressTypes as $randomAddressType) {
                $talent->addresses()->create([
                    'info' => $this->faker->sentence(6),
                    'address_type_id' => $randomAddressType->id,
                ]);
            }
        }
    }
}
