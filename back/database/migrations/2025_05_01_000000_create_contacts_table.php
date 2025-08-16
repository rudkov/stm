<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->text('notes')->nullable();

            $table->foreignId('team_id')->constrained()->onDelete('cascade');

            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');

            $table->softDeletes();
            $table->timestamps();

            $table->index('deleted_at');
        });

        // TODO: Remove this if statement once we migrate tests to MySQL
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE contacts ADD CONSTRAINT first_name_or_last_name_required 
                               CHECK (first_name IS NOT NULL OR last_name IS NOT NULL)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
