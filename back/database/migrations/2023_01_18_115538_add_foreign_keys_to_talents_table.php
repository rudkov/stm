<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('talents', function (Blueprint $table) {
            $table->foreign('hair_color_id')->references('id')->on('talent_hair_colors');
            $table->foreign('hair_length_id')->references('id')->on('talent_hair_lengths');
            $table->foreign('eye_color_id')->references('id')->on('talent_eye_colors');
            $table->foreign('cup_size_id')->references('id')->on('talent_cup_sizes');
            $table->foreign('shoe_size_id')->references('id')->on('talent_shoe_sizes');
            $table->foreign('skin_color_id')->references('id')->on('talent_skin_colors');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('talents', function (Blueprint $table) {
            $table->dropForeign('talents_hair_color_id_foreign');
            $table->dropForeign('talents_hair_length_id_foreign');
            $table->dropForeign('talents_eye_color_id_foreign');
            $table->dropForeign('talents_cup_size_id_foreign');
            $table->dropForeign('talents_shoe_size_id_foreign');
            $table->dropForeign('talents_skin_color_id_foreign');
        });
    }
};
