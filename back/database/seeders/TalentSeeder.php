<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Country;
use App\Models\Language;
use App\Models\Talent;
use App\Models\TalentRelative;

class TalentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $talents = $this->createTalents();
        $this->createTalentCitizenships($talents);
        $this->createTalentLanguages($talents);
        $this->createTalentRelatives();
    }

    /**
     * Create talents using factory.
     */
    private function createTalents()
    {
        return Talent::factory(50)->create();
    }

    /**
     * Create citizenship relationships for talents.
     */
    private function createTalentCitizenships($talents): void
    {
        $citizenships = Country::all();

        if ($citizenships->isEmpty()) {
            $this->command->warn('Skipping talent citizenships: No countries found');
            return;
        }

        foreach ($talents as $talent) {
            $randomCitizenships = $citizenships->random(rand(1, 3));

            foreach ($randomCitizenships as $randomCitizenship) {
                $talent->citizenships()->save($randomCitizenship);
            }
        }
    }

    /**
     * Create language relationships for talents.
     */
    private function createTalentLanguages($talents): void
    {
        $languages = Language::all();

        if ($languages->isEmpty()) {
            $this->command->warn('Skipping talent languages: No languages found');
            return;
        }

        foreach ($talents as $talent) {
            $randomLanguages = $languages->random(rand(1, 3));

            foreach ($randomLanguages as $randomLanguage) {
                $talent->languages()->save($randomLanguage);
            }
        }
    }

    /**
     * Create talent relatives using factory.
     */
    private function createTalentRelatives(): void
    {
        TalentRelative::factory(150)->create();
    }
}
