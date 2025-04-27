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
            //    // primary info
            //    $table->string('first_name');
            'first_name' => $this->faker->firstName(),
            //    $table->string('last_name');
            'last_name' => $this->faker->lastName(),
            //    $table->string('legal_first_name');
            'legal_first_name' => $this->faker->firstName(),
            //    $table->string('legal_last_name');
            'legal_last_name' => $this->faker->lastName(),
            //    $table->tinyInteger('gender_id')->nullable()->unsigned()->index();
            'gender_id' => TalentGender::all()->random()->id,
            //    $table->timestamp('birth_date');
            'birth_date' => $this->faker->dateTime(),
            //    $table->smallInteger('mother_agency_id')->nullable()->unsigned()->index();
            //    $table->tinyInteger('marital_status_id')->nullable()->unsigned();
            'marital_status_id' => TalentMaritalStatus::all()->random()->id,
            //    $table->tinyInteger('lifestyle_or_fashion_id')->nullable()->unsigned();
            'is_lifestyle' => rand(0,1),

            //    // measurements
            //    $table->tinyInteger('hair_color_id')->nullable()->unsigned()->index();
            'hair_color_id' => TalentHairColor::all()->random()->id,
            //    $table->tinyInteger('hair_length_id')->nullable()->unsigned()->index();
            'hair_length_id' => TalentHairLength::all()->random()->id,
            //    $table->tinyInteger('eye_color_id')->nullable()->unsigned()->index();
            'eye_color_id' => TalentEyeColor::all()->random()->id,
            //    $table->smallInteger('height_cm')->nullable()->unsigned();
            'height_cm' => rand(160,198),
            //    $table->tinyInteger('bust_cm')->nullable()->unsigned();
            'bust_cm' => rand(65,120),
            //    $table->tinyInteger('cup_size_id')->nullable()->unsigned()->index();
            'cup_size_id' => TalentCupSize::all()->random()->id,
            //    $table->tinyInteger('waist_cm')->nullable()->unsigned();
            'waist_cm' => rand(50,90),
            //    $table->tinyInteger('hips_cm')->nullable()->unsigned();
            'hips_cm' => rand(65,120),
            //    $table->tinyInteger('weight_kg')->nullable()->unsigned();
            'weight_kg' => rand(50,90),
            //    $table->tinyInteger('shoe_size_id')->nullable()->unsigned();
            'shoe_size_id' => TalentShoeSize::all()->random()->id,
            //    // shirt
            'shirt_size_id' => TalentShirtSize::all()->random()->id,
            //    // suit cut
            'suit_cut_id' => TalentSuitCut::all()->random()->id,
            //    // dress size
            'dress_size_id' => TalentDressSize::all()->random()->id,
            //    $table->tinyInteger('skin_color_id')->nullable()->unsigned()->index();
            'skin_color_id' => TalentSkinColor::all()->random()->id,
            //    $table->boolean('ears_pierced')->nullable();
            'is_ears_pierced' => rand(0,1),
            //    $table->text('scars');
            'scars' => $this->faker->sentence(6),
            //    $table->text('tattoos');
            'tattoos' => $this->faker->sentence(6),
            //    $table->text('piercings');
            'piercings' => $this->faker->sentence(6),
            
            'current_location' => [null,$this->faker->city()][rand(0,1)],

            //    // 'parents' section: father, mother (see screenshot)

            //    // other info
            //    // citizenships
            //    // languages
            //    $table->boolean('vegetarian')->nullable();
            'is_vegetarian' => rand(0,1),
            //    $table->text('allergies');
            'allergies' => $this->faker->sentence(6),
            //    $table->boolean('accent')->nullable();
            'is_accent' => rand(0,1),
            
            //    // comment
            //    $table->text('comment');
            'comment' => $this->faker->sentence(20),

            //    // emails

            //    // phones

            //    // addresses

            //    // social media

            //    // messengers

            //    // how to name this section
            //    $table->boolean('lingerie')->nullable();
            'is_lingerie' => rand(0,1),
            //    $table->boolean('nude')->nullable();
            'is_nude' => rand(0,1),
            //    $table->boolean('fur')->nullable();
            'is_fur' => rand(0,1),
            //    $table->boolean('liquor_ads')->nullable();
            'is_liquor_ads' => rand(0,1),
            //    $table->boolean('smoking_ads')->nullable();
            'is_smoking_ads' => rand(0,1),
            //    $table->boolean('gambling_ads')->nullable();
            'is_gambling_ads' => rand(0,1),
            //    $table->boolean('faithbased_ads')->nullable();
            'is_faithbased_ads' => rand(0,1),
            //    $table->boolean('political_ads')->nullable();
            'is_political_ads' => rand(0,1),
            //    $table->boolean('topless')->nullable();
            'is_topless' => rand(0,1),
            //    $table->boolean('swimwear')->nullable();
            'is_swimwear' => rand(0,1),
            //    $table->boolean('sports')->nullable();
            'is_sports' => rand(0,1),

            //    // achievements
            //    $table->text('achievements');
            'achievements' => $this->faker->sentence(20),

            //    // biography
            //    $table->text('biography');
            'biography' => $this->faker->sentence(20),

            //    // performance skills
            //    $table->text('performance_skills');
            'performance_skills' => $this->faker->sentence(20),

            'team_id' => $team_id,
            'created_by' => $users[$team_id]->random()->id,
            'updated_by' => $users[$team_id]->random()->id,
        ];
    }
}
