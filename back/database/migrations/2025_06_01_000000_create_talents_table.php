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

            $table->foreignId('team_id')->index()->constrained()->onDelete('cascade');

            $table->string('first_name');
            $table->string('last_name');
            $table->string('legal_first_name')->nullable();
            $table->string('legal_last_name')->nullable();
            $table->unsignedBigInteger('gender_id')->nullable();
            $table->date('birth_date')->nullable();
            $table->unsignedBigInteger('marital_status_id')->nullable();
            $table->boolean('is_lifestyle')->nullable();
            $table->unsignedBigInteger('manager_id')->nullable();
            $table->foreign('manager_id')->references('id')->on('users');

            $table->unsignedBigInteger('hair_color_id')->nullable();
            $table->unsignedBigInteger('hair_length_id')->nullable();
            $table->unsignedBigInteger('eye_color_id')->nullable();
            $table->smallInteger('height_cm')->nullable()->unsigned();
            $table->tinyInteger('bust_cm')->nullable()->unsigned();
            $table->unsignedBigInteger('cup_size_id')->nullable();
            $table->tinyInteger('waist_cm')->nullable()->unsigned();
            $table->tinyInteger('hips_cm')->nullable()->unsigned();
            $table->tinyInteger('weight_kg')->nullable()->unsigned();
            $table->unsignedBigInteger('shoe_size_id')->nullable();
            $table->unsignedBigInteger('shirt_size_id')->nullable();
            $table->unsignedBigInteger('suit_cut_id')->nullable();
            $table->unsignedBigInteger('dress_size_id')->nullable();
            $table->unsignedBigInteger('skin_color_id')->nullable();
            $table->boolean('is_ears_pierced')->nullable();
            $table->text('scars')->nullable();
            $table->text('tattoos')->nullable();
            $table->text('piercings')->nullable();

            $table->string('location')->nullable();

            $table->boolean('is_vegetarian')->nullable();
            $table->text('allergies')->nullable();
            $table->boolean('is_accent')->nullable();

            $table->text('notes')->nullable();

            $table->boolean('is_lingerie')->nullable();
            $table->boolean('is_nude')->nullable();
            $table->boolean('is_fur')->nullable();
            $table->boolean('is_liquor_ads')->nullable();
            $table->boolean('is_smoking_ads')->nullable();
            $table->boolean('is_gambling_ads')->nullable();
            $table->boolean('is_faithbased_ads')->nullable();
            $table->boolean('is_political_ads')->nullable();
            $table->boolean('is_topless')->nullable();
            $table->boolean('is_swimwear')->nullable();
            $table->boolean('is_sports')->nullable();

            $table->text('achievements')->nullable();
            $table->text('biography')->nullable();
            $table->text('performance_skills')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users');

            $table->unsignedBigInteger('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('users');

            $table->foreign('hair_color_id')->references('id')->on('talent_hair_colors');
            $table->foreign('hair_length_id')->references('id')->on('talent_hair_lengths');
            $table->foreign('eye_color_id')->references('id')->on('talent_eye_colors');
            $table->foreign('cup_size_id')->references('id')->on('talent_cup_sizes');
            $table->foreign('shoe_size_id')->references('id')->on('talent_shoe_sizes');
            $table->foreign('skin_color_id')->references('id')->on('talent_skin_colors');
            $table->foreign('shirt_size_id')->references('id')->on('talent_shirt_sizes');
            $table->foreign('suit_cut_id')->references('id')->on('talent_suit_cuts');
            $table->foreign('dress_size_id')->references('id')->on('talent_dress_sizes');

            $table->foreign('marital_status_id')->references('id')->on('talent_marital_statuses');

            $table->foreign('gender_id')->references('id')->on('talent_genders');

            $table->foreignId('board_id')->nullable()->index()->constrained('talent_boards')->nullOnDelete();

            $table->uuid('mother_agency_id')->nullable();
            $table->foreign('mother_agency_id')->references('id')->on('companies');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talents');
    }
};
