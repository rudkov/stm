<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Always run foundation/system data (production-safe)
        $this->command->info('Seeding foundation data...');
        $this->call([
            FirstTimeSeeder::class,
        ]);

        // Only run development/testing data in non-production environments
        if (app()->environment(['local', 'testing', 'development'])) {
            $this->command->info('Seeding development/testing data...');

            $this->call([
                // Core Entities (test data)
                TeamSeeder::class,
                UserSeeder::class,
                CompanySeeder::class,
                ContactSeeder::class,
                TalentSeeder::class,
                EventSeeder::class,

                // Polymorphic Contact Information
                AddressSeeder::class,
                EmailSeeder::class,
                MessengerSeeder::class,
                PhoneSeeder::class,
                SocialMediaSeeder::class,
                WeblinkSeeder::class,
            ]);
        } else {
            $this->command->warn('Skipping development seeders in ' . app()->environment() . ' environment');
        }

        $this->command->info('Database seeding completed!');
    }
}
