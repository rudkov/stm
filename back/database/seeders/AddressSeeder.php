<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\CommunicationType;

use App\Models\Company;
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

        $companies = Company::all();
        $talents = Talent::all();

        foreach ($companies as $company) {
            $randomAddressTypes = $addressTypes[$company->team_id]->random(rand(1, count($addressTypes[$company->team_id])));

            foreach ($randomAddressTypes as $randomAddressType) {
                $company->addresses()->create([
                    'info' => fake()->address,
                    'communication_type_id' => $randomAddressType->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomAddressTypes = $addressTypes[$talent->team_id]->random(rand(1, count($addressTypes[$talent->team_id])));

            foreach ($randomAddressTypes as $randomAddressType) {
                $talent->addresses()->create([
                    'info' => fake()->address,
                    'communication_type_id' => $randomAddressType->id,
                ]);
            }
        }
    }
}
