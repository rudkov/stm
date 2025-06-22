<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\CommunicationType;
use App\Models\Talent;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $addressTypes = CommunicationType::where('type', 'address')
            ->orderBy('weight')
            ->get()
            ->groupBy('team_id');

        $talents = Talent::all();

        foreach ($talents as $talent) {
            $randomAddressTypes = $addressTypes[$talent->team_id]->random(rand(1, count($addressTypes[$talent->team_id])));

            foreach ($randomAddressTypes as $randomAddressType) {
                $talent->addresses()->create([
                    'info' => fake()->sentence(6),
                    'communication_type_id' => $randomAddressType->id,
                    'addressable_type' => $talent::class,
                    'addressable_id' => $talent->id,
                ]);
            }
        }
    }
}
