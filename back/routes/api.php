<?php
// GET: retrieve resources
// POST: create resources
// PUT: update resources
// DELETE: delete resources

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function () {

    //auth
    Route::post('login', 'LoginController@login');
    Route::post('logout', 'LoginController@logout');
    Route::get('is-logged-in', 'LoginController@isLoggedIn');
    Route::post('register', 'Auth\RegisterController@createAndAuthenticate');

    //settings
    Route::get('settings', 'SettingsController@index');

    Route::group(['middleware' => 'auth:sanctum'], function () {

        //contacts
        Route::apiResource('contacts', 'ContactController');

        //communication types
        Route::get('communication-types', 'CommunicationTypeController@index')
            ->name('communication-types.index');
        Route::put('communication-types', 'CommunicationTypeController@update')
            ->name('communication-types.update');

        //companies
        Route::apiResource('companies', 'CompanyController');

        //teams
        Route::post('teams', 'TeamController@store');

        //talents
        Route::get('talents/locations', 'TalentController@locations')->name('talents.locations');
        Route::get('talents/managers', 'TalentController@managers')->name('talents.managers');
        Route::post('talents/search', 'TalentController@search')->name('talents.search');
        Route::put('talents/{talent}/locations/current', 'TalentController@updateLocation')->name('talents.update-location');
        Route::apiResource('talents', 'TalentController');

        //talent boards
        Route::apiResource('talent-boards', 'TalentBoardController');

        //team settings
        Route::get('settings/team', 'SettingsController@team')
            ->name('settings.team');

        //events
        Route::post('events/search', 'EventController@index');

        //event
        Route::get('events/{id}', 'EventController@show');

        //users
        Route::post('users/search', 'UserController@index');
    });
});
