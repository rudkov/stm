<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\SocialMediaType;

use App\Models\Company;
use App\Models\Talent;

class SocialMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialMediaTypes = SocialMediaType::all();

        $companies = Company::all();
        $talents = Talent::all();

        foreach ($companies as $company) {
            $randomSocialMediaTypes = $socialMediaTypes->random(rand(1, count($socialMediaTypes)));

            foreach ($randomSocialMediaTypes as $randomSocialMediaType) {
                $company->socialMedias()->create([
                    'info' => fake()->userName,
                    'social_media_type_id' => $randomSocialMediaType->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomSocialMediaTypes = $socialMediaTypes->random(rand(1, count($socialMediaTypes)));

            foreach ($randomSocialMediaTypes as $randomSocialMediaType) {
                $talent->socialMedias()->create([
                    'info' => fake()->userName,
                    'social_media_type_id' => $randomSocialMediaType->id,
                ]);
            }
        }
    }
}
