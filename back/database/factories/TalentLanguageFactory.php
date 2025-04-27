<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Talent;
use App\Models\Language;

class TalentLanguageFactory extends Factory
{
    public function definition()
    {
        return [
            //
        ];
    }

    public function run()
    {
        $talents = Talent::all();
        $languages = Language::all();

        foreach($talents as $talent) {
            $randomLanguages = $languages->random(rand(1,3));

            foreach($randomLanguages as $randomLanguage) {
                $talent->languages()->save($randomLanguage);
            }
        }
    }
}
