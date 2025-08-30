<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talents', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('first_name');
            $table->string('last_name');
            $table->string('legal_first_name')->nullable();
            $table->string('legal_last_name')->nullable();
            $table->date('birth_date')->nullable()->index();

            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null');

            $table->foreignId('board_id')->nullable()->constrained('talent_boards')->onDelete('set null');
            $table->foreignId('gender_id')->nullable()->constrained('talent_genders')->onDelete('set null');
            $table->foreignId('marital_status_id')->nullable()->constrained('talent_marital_statuses')->onDelete('set null');
            $table->foreignUuid('mother_agency_id')->nullable()->constrained('companies')->onDelete('set null');

            $table->string('location')->nullable()->index();

            $table->foreignId('cup_size_id')->nullable()->constrained('talent_cup_sizes')->onDelete('set null');
            $table->foreignId('dress_size_id')->nullable()->constrained('talent_dress_sizes')->onDelete('set null');
            $table->foreignId('eye_color_id')->nullable()->constrained('talent_eye_colors')->onDelete('set null');
            $table->foreignId('hair_color_id')->nullable()->constrained('talent_hair_colors')->onDelete('set null');
            $table->foreignId('hair_length_id')->nullable()->constrained('talent_hair_lengths')->onDelete('set null');
            $table->foreignId('skin_color_id')->nullable()->constrained('talent_skin_colors')->onDelete('set null');
            $table->foreignId('shirt_size_id')->nullable()->constrained('talent_shirt_sizes')->onDelete('set null');
            $table->foreignId('shoe_size_id')->nullable()->constrained('talent_shoe_sizes')->onDelete('set null');
            $table->foreignId('suit_cut_id')->nullable()->constrained('talent_suit_cuts')->onDelete('set null');

            $table->tinyInteger('bust_cm')->nullable()->unsigned()->index();
            $table->smallInteger('height_cm')->nullable()->unsigned()->index();
            $table->tinyInteger('hips_cm')->nullable()->unsigned()->index();
            $table->tinyInteger('waist_cm')->nullable()->unsigned()->index();
            $table->tinyInteger('weight_kg')->nullable()->unsigned()->index();

            $table->boolean('is_accent')->nullable();
            $table->boolean('is_ears_pierced')->nullable();
            $table->boolean('is_faithbased_ads')->nullable()->index();
            $table->boolean('is_fur')->nullable()->index();
            $table->boolean('is_gambling_ads')->nullable()->index();
            $table->boolean('is_lifestyle')->nullable();
            $table->boolean('is_lingerie')->nullable()->index();
            $table->boolean('is_liquor_ads')->nullable()->index();
            $table->boolean('is_nude')->nullable()->index();
            $table->boolean('is_political_ads')->nullable()->index();
            $table->boolean('is_smoking_ads')->nullable()->index();
            $table->boolean('is_sports')->nullable()->index();
            $table->boolean('is_swimwear')->nullable()->index();
            $table->boolean('is_topless')->nullable()->index();
            $table->boolean('is_vegetarian')->nullable()->index();

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
    }

    public function down(): void
    {
        Schema::dropIfExists('talents');
    }
};
