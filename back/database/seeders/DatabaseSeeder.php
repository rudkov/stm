<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use Database\Seeders\FirstTimeSeeder;

use Database\Factories\EventChunkFactory;
use Database\Factories\EventTalentFactory;
use Database\Factories\TalentMessengerFactory;
use Database\Factories\TalentPhoneFactory;
use Database\Factories\TalentSocialMediaFactory;
use Database\Factories\TalentCitizenshipFactory;
use Database\Factories\TalentLanguageFactory;
use Database\Factories\TalentAddressFactory;
use Database\Factories\TalentEmailFactory;
use Database\Factories\ContactPhoneFactory;
use Database\Factories\ContactEmailFactory;
use Database\Factories\ContactMessengerFactory;
use Database\Factories\CompanyContactFactory;
use Database\Factories\EventContactFactory;
use Database\Factories\EventClientFactory;
use Database\Factories\TalentMotherAgencyFactory;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $firstTimeSeeder = new FirstTimeSeeder();
        $firstTimeSeeder->run();

        \App\Models\Team::factory(3)->create();
        \App\Models\User::factory(10)->create();
        
        // Create talent boards for factory-created teams (which don't use Team::create())
        $teams = \App\Models\Team::all();
        foreach ($teams as $team) {
            if ($team->talentBoards()->count() === 0) {
                $firstUser = \App\Models\User::where('team_id', $team->id)->first();
                if ($firstUser) {
                    $team->createDefaultTalentBoards($firstUser->id);
                }
            }
        }
        \App\Models\Talent::factory(50)->create();
        \App\Models\TalentRelative::factory(150)->create();

        $talentCitizenshipFactory = new TalentCitizenshipFactory();
        $talentCitizenshipFactory->run();

        $talentLanguageFactory = new TalentLanguageFactory();
        $talentLanguageFactory->run();

        $talentAddressFactory = new TalentAddressFactory();
        $talentAddressFactory->run();

        $talentPhoneFactory = new TalentPhoneFactory();
        $talentPhoneFactory->run();

        $talentEmailFactory = new TalentEmailFactory();
        $talentEmailFactory->run();

        $talentSocialMediaFactory = new TalentSocialMediaFactory();
        $talentSocialMediaFactory->run();

        $talentMessengerFactory = new TalentMessengerFactory();
        $talentMessengerFactory->run();

        \App\Models\Company::factory(50)->create();
        \App\Models\Contact::factory(50)->create();

        $contactPhoneFactory = new ContactPhoneFactory();
        $contactPhoneFactory->run();

        $contactEmailFactory = new ContactEmailFactory();
        $contactEmailFactory->run();

        $contactMessengerFactory = new ContactMessengerFactory();
        $contactMessengerFactory->run();

        $companyContactFactory = new CompanyContactFactory();
        $companyContactFactory->run();

        $talentMotherAgencyFactory = new TalentMotherAgencyFactory();
        $talentMotherAgencyFactory->run();

        \App\Models\Event::factory(50)->create();

        $eventChunkFactory = new EventChunkFactory();
        $eventChunkFactory->run();

        $eventTalentFactory = new EventTalentFactory();
        $eventTalentFactory->run();

        $eventContactFactory = new EventContactFactory();
        $eventContactFactory->run();

        $eventClientFactory = new EventClientFactory();
        $eventClientFactory->run();
    }
}
