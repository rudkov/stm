<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Contact;
use App\Models\Talent;

class WeblinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contacts = Contact::all();
        $talents = Talent::all();

        foreach ($contacts as $contact) {
            $randomNumberOfWeblinks = rand(0, 2);

            for ($i = 0; $i < $randomNumberOfWeblinks; $i++) {
                $contact->weblinks()->create([
                    'info' => fake()->url,
                    'weblinkable_type' => $contact::class,
                    'weblinkable_id' => $contact->id,
                ]);
            }
        }

        foreach ($talents as $talent) {
            $randomNumberOfWeblinks = rand(0, 2);

            for ($i = 0; $i < $randomNumberOfWeblinks; $i++) {
                $talent->weblinks()->create([
                    'info' => fake()->url,
                    'weblinkable_type' => $talent::class,
                    'weblinkable_id' => $talent->id,
                ]);
            }
        }
    }
}
