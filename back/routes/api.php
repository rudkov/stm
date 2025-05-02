<?php
// GET: retrieve resources
// POST: create resources
// PUT: update resources
// DELETE: delete resources

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// use \App\Http\Controllers\TalentController;

Route::group(['prefix' => 'v1'], function () {

    //auth
    Route::post('login', 'LoginController@login');
    Route::post('logout', 'LoginController@logout');
    Route::get('is-logged-in', 'LoginController@isLoggedIn');
    Route::post('register', 'Auth\RegisterController@createAndAuthenticate');

    //settings
    Route::get('settings','SettingsController@index');

    Route::group(['middleware' => 'auth:sanctum'], function () {

        //clients
        Route::get('clients', 'ClientController@index');

        //contacts
        Route::apiResource('contacts', 'ContactController');
        
        //companies
        Route::get('companies', 'CompanyController@index');

        //teams
        Route::post('teams', 'TeamController@store');

        //talents
        Route::get('talents', 'TalentController@index');

        //talent current location
        Route::put('talents/{id}/locations/current', 'TalentController@updateCurrentLocation');

        //talent
        Route::get('talents/{id}', 'TalentController@show');//->middleware('can:view,talent');
        Route::put('talents/{id}', 'TalentController@update');//->middleware('can:update,talent');
        Route::post('talents', 'TalentController@store');
        Route::delete('talents/{id}', 'TalentController@destroy');
        
        //events
        Route::post('events/search','EventController@index');

        //event
        Route::get('events/{id}', 'EventController@show');

        // Route::apiResource('talents', TalentController::class);
    });
});