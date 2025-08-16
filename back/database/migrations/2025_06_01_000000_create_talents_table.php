<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talents', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('legal_first_name')->nullable();
            $table->string('legal_last_name')->nullable();
            $table->date('birth_date')->nullable();

            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null');

            $table->foreignId('board_id')->nullable()->constrained('talent_boards')->onDelete('set null');
            $table->foreignId('gender_id')->nullable()->constrained('talent_genders')->onDelete('set null');
            $table->foreignId('marital_status_id')->nullable()->constrained('talent_marital_statuses')->onDelete('set null');
            $table->foreignUuid('mother_agency_id')->nullable()->constrained('companies')->onDelete('set null');

            $table->string('location')->nullable();

            $table->foreignId('cup_size_id')->nullable()->constrained('talent_cup_sizes')->onDelete('set null');
            $table->foreignId('dress_size_id')->nullable()->constrained('talent_dress_sizes')->onDelete('set null');
            $table->foreignId('eye_color_id')->nullable()->constrained('talent_eye_colors')->onDelete('set null');
            $table->foreignId('hair_color_id')->nullable()->constrained('talent_hair_colors')->onDelete('set null');
            $table->foreignId('hair_length_id')->nullable()->constrained('talent_hair_lengths')->onDelete('set null');
            $table->foreignId('skin_color_id')->nullable()->constrained('talent_skin_colors')->onDelete('set null');
            $table->foreignId('shirt_size_id')->nullable()->constrained('talent_shirt_sizes')->onDelete('set null');
            $table->foreignId('shoe_size_id')->nullable()->constrained('talent_shoe_sizes')->onDelete('set null');
            $table->foreignId('suit_cut_id')->nullable()->constrained('talent_suit_cuts')->onDelete('set null');

            $table->tinyInteger('bust_cm')->nullable()->unsigned();
            $table->smallInteger('height_cm')->nullable()->unsigned();
            $table->tinyInteger('hips_cm')->nullable()->unsigned();
            $table->tinyInteger('waist_cm')->nullable()->unsigned();
            $table->tinyInteger('weight_kg')->nullable()->unsigned();

            $table->boolean('is_accent')->nullable();
            $table->boolean('is_ears_pierced')->nullable();
            $table->boolean('is_faithbased_ads')->nullable();
            $table->boolean('is_fur')->nullable();
            $table->boolean('is_gambling_ads')->nullable();
            $table->boolean('is_lifestyle')->nullable();
            $table->boolean('is_lingerie')->nullable();
            $table->boolean('is_liquor_ads')->nullable();
            $table->boolean('is_nude')->nullable();
            $table->boolean('is_political_ads')->nullable();
            $table->boolean('is_smoking_ads')->nullable();
            $table->boolean('is_sports')->nullable();
            $table->boolean('is_swimwear')->nullable();
            $table->boolean('is_topless')->nullable();
            $table->boolean('is_vegetarian')->nullable();

            $table->text('achievements')->nullable();
            $table->text('allergies')->nullable();
            $table->text('biography')->nullable();
            $table->text('notes')->nullable();
            $table->text('performance_skills')->nullable();
            $table->text('piercings')->nullable();
            $table->text('scars')->nullable();
            $table->text('tattoos')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');

            $table->softDeletes();
            $table->timestamps();

            $table->index('deleted_at');
        });

        // TODO: Remove this if statement once we migrate tests to MySQL
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE talents ADD CONSTRAINT first_name_or_last_name_required 
                       CHECK (first_name IS NOT NULL OR last_name IS NOT NULL)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('talents');
    }
};
