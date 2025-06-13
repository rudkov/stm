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
    Route::get('settings','SettingsController@index');

    Route::group(['middleware' => 'auth:sanctum'], function () {

        //contacts
        Route::apiResource('contacts', 'ContactController');
        
        //companies
        Route::apiResource('companies', 'CompanyController');

        //teams
        Route::post('teams', 'TeamController@store');

        //talents
        Route::post('talents/search', 'TalentController@index');
        Route::get('talents/locations', 'TalentController@locations');
        Route::get('talents/managers', 'TalentController@managers');

        //talent current location
        Route::put('talents/{id}/locations/current', 'TalentController@updateCurrentLocation');

        //talent
        Route::get('talents/{id}', 'TalentController@show');//->middleware('can:view,talent');
        Route::put('talents/{id}', 'TalentController@update');//->middleware('can:update,talent');
        Route::post('talents', 'TalentController@store');
        Route::delete('talents/{id}', 'TalentController@destroy');

        //talent boards
        Route::apiResource('talent-boards', 'TalentBoardController');
        
        //events
        Route::post('events/search','EventController@index');

        //event
        Route::get('events/{id}', 'EventController@show');

        //users
        Route::post('users/search', 'UserController@index');
    });
});