<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Team;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 3; $i++) {
            Team::create([
                'name' => fake()->company(),
            ]);
        }
    }
}
