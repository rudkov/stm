<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTalentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('talents', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // primary info
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

            // measurements
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

            $table->string('current_location')->nullable();

            // other info
            // citizenships
            // languages
            $table->boolean('is_vegetarian')->nullable();
            $table->text('allergies')->nullable();
            $table->boolean('is_accent')->nullable();

            // comment
            $table->text('comment')->nullable();

            // emails

            // phones

            // addresses

            // social media

            // messengers

            // how to name this section
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

            // achievements
            $table->text('achievements')->nullable();

            // biography
            $table->text('biography')->nullable();

            // performance skills
            $table->text('performance_skills')->nullable();

            $table->unsignedBigInteger('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users');

            $table->unsignedBigInteger('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('users');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('talents');
    }
}
