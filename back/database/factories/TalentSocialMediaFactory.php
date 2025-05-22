<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Talent;
use App\Models\TalentSocialMedia;
use App\Models\SocialMediaType;

class TalentSocialMediaFactory extends Factory
{
    public function definition()
    {
        return [];
    }

    public function run()
    {
        $talents = Talent::all();
        $socialMediaTypes = SocialMediaType::all();

        foreach ($talents as $talent) {
            $randomSocialMediaTypes = $socialMediaTypes->random(rand(1, count($socialMediaTypes)));

            foreach ($randomSocialMediaTypes as $randomSocialMediaType) {
                $talent->socialMedias()->saveMany([
                    new TalentSocialMedia([
                        'info' => $this->faker->userName,
                        'social_media_type_id' => $randomSocialMediaType->id,
                    ]),
                ]);
            }
        }
    }
}
