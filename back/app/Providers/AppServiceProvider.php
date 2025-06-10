<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use App\Models\Team;
use App\Observers\TeamObserver;
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

        Team::observe(TeamObserver::class);

        Relation::enforceMorphMap([
            'event' => 'App\Models\Event',
            'event-chunk' => 'App\Models\EventChunk',
            'talent' => 'App\Models\Talent',
        ]);
    }
}
