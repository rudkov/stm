<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\AddressType;

use App\Models\Talent;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $addressTypes = AddressType::all();

        $talents = Talent::all();

        foreach ($talents as $talent) {
            $randomAddressTypes = $addressTypes->random(rand(1, count($addressTypes)));

            foreach ($randomAddressTypes as $randomAddressType) {
                $talent->addresses()->create([
                    'info' => fake()->address,
                    'address_type_id' => $randomAddressType->id,
                    'addressable_type' => $talent::class,
                    'addressable_id' => $talent->id,
                ]);
            }
        }
    }
}
