<?php

namespace App\Console\Commands;

use Database\Factories\TalentFactory;
use Illuminate\Console\Command;

class ClearFactoryCacheCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'factory:clear-cache {--talent : Clear only TalentFactory cache}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear factory caches to ensure fresh data generation';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if ($this->option('talent')) {
            TalentFactory::clearCache();
            $this->info('TalentFactory cache cleared successfully.');
        } else {
            // Clear all factory caches (expand as needed)
            TalentFactory::clearCache();
            $this->info('All factory caches cleared successfully.');
        }

        return self::SUCCESS;
    }
}
