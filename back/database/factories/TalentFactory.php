<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Talent;
use App\Models\TalentCupSize;
use App\Models\TalentDressSize;
use App\Models\TalentEyeColor;
use App\Models\TalentGender;
use App\Models\TalentHairColor;
use App\Models\TalentHairLength;
use App\Models\TalentMaritalStatus;
use App\Models\TalentShirtSize;
use App\Models\TalentShoeSize;
use App\Models\TalentSkinColor;
use App\Models\TalentSuitCut;
use App\Models\Team;
use App\Models\User;

class TalentFactory extends Factory
{
    protected $model = Talent::class;

    public function definition()
    {
        $users = User::all()->groupBy('team_id');
        $team_id = Team::all()->random()->id;

        return [

            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'legal_first_name' => $this->faker->firstName(),
            'legal_last_name' => $this->faker->lastName(),
            'gender_id' => TalentGender::all()->random()->id,
            'birth_date' => $this->faker->dateTime(),
            'marital_status_id' => TalentMaritalStatus::all()->random()->id,
            'is_lifestyle' => rand(0, 1),
            'manager_id' => $users[$team_id]->random()->id,

            'hair_color_id' => TalentHairColor::all()->random()->id,
            'hair_length_id' => TalentHairLength::all()->random()->id,
            'eye_color_id' => TalentEyeColor::all()->random()->id,
            'height_cm' => rand(70, 210),
            'bust_cm' => rand(55, 160),
            'cup_size_id' => TalentCupSize::all()->random()->id,
            'waist_cm' => rand(45, 150),
            'hips_cm' => rand(55, 170),
            'weight_kg' => rand(15, 180),
            'shoe_size_id' => TalentShoeSize::all()->random()->id,
            'shirt_size_id' => TalentShirtSize::all()->random()->id,
            'suit_cut_id' => TalentSuitCut::all()->random()->id,
            'dress_size_id' => TalentDressSize::all()->random()->id,
            'skin_color_id' => TalentSkinColor::all()->random()->id,
            'is_ears_pierced' => rand(0, 1),
            'scars' => $this->faker->sentence(6),
            'tattoos' => $this->faker->sentence(6),
            'piercings' => $this->faker->sentence(6),

            'current_location' => [null, $this->faker->city()][rand(0, 1)],

            'is_vegetarian' => rand(0, 1),
            'allergies' => $this->faker->sentence(6),
            'is_accent' => rand(0, 1),

            'comment' => $this->faker->sentence(20),

            'is_lingerie' => rand(0, 1),
            'is_nude' => rand(0, 1),
            'is_fur' => rand(0, 1),
            'is_liquor_ads' => rand(0, 1),
            'is_smoking_ads' => rand(0, 1),
            'is_gambling_ads' => rand(0, 1),
            'is_faithbased_ads' => rand(0, 1),
            'is_political_ads' => rand(0, 1),
            'is_topless' => rand(0, 1),
            'is_swimwear' => rand(0, 1),
            'is_sports' => rand(0, 1),

            'achievements' => $this->faker->sentence(20),
            'biography' => $this->faker->sentence(20),
            'performance_skills' => $this->faker->sentence(20),

            'team_id' => $team_id,
            'created_by' => $users[$team_id]->random()->id,
            'updated_by' => $users[$team_id]->random()->id,
        ];
    }
}
