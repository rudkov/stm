<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use App\Models\Team;

use App\Services\TeamInitializationService;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 3; $i++) {
            DB::transaction(function () {
                $team = Team::create([
                    'name' => fake()->company(),
                ]);
                TeamInitializationService::run($team);
            });
        }
    }
}
