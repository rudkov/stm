<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\SocialMediaType;

use App\Models\Talent;

class SocialMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialMediaTypes = SocialMediaType::all();

        $talents = Talent::all();

        foreach ($talents as $talent) {
            $randomSocialMediaTypes = $socialMediaTypes->random(rand(1, count($socialMediaTypes)));

            foreach ($randomSocialMediaTypes as $randomSocialMediaType) {
                $talent->socialMedias()->create([
                    'info' => fake()->userName,
                    'social_media_type_id' => $randomSocialMediaType->id,
                    'social_mediaable_type' => $talent::class,
                    'social_mediaable_id' => $talent->id,
                ]);
            }
        }
    }
}
