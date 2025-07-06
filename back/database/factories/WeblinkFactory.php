<?php

namespace Database\Factories;

use App\Models\Weblink;
use Illuminate\Database\Eloquent\Factories\Factory;

class WeblinkFactory extends Factory
{
    protected $model = Weblink::class;

    public function definition()
    {
        return [
            'info' => $this->faker->url(),
            'weblinkable_id' => null, // Will be set when creating
            'weblinkable_type' => null, // Will be set when creating
        ];
    }
}
