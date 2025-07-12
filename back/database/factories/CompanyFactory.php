<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Company;
use App\Models\User;

class CompanyFactory extends Factory
{
    protected $model = Company::class;
    
    public function definition(): array
    {
        $users = User::all()->groupBy('team_id');
        $team_id = $users->keys()->random();
        
        return [
            'name' => $this->faker->company(),
            'notes' => $this->faker->sentence(),
            'team_id' => $team_id,
            'created_by' => $users[$team_id]->random()->id,
            'updated_by' => $users[$team_id]->random()->id,
        ];
    }
}
