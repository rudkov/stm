<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        JsonResource::withoutWrapping();

        Relation::enforceMorphMap([
            'company'       => 'App\Models\Company',
            'contact'       => 'App\Models\Contact',
            'event'         => 'App\Models\Event',
            'event-chunk'   => 'App\Models\EventChunk',
            'talent'        => 'App\Models\Talent',
        ]);
    }
}
