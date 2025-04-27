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
            $table->foreign('shirt_size_id')->references('id')->on('talent_shirt_sizes');
            $table->foreign('suit_cut_id')->references('id')->on('talent_suit_cuts');
            $table->foreign('dress_size_id')->references('id')->on('talent_dress_sizes');
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
            $table->dropForeign('talents_shirt_size_id_foreign');
            $table->dropForeign('talents_suit_cut_id_foreign');
            $table->dropForeign('talents_dress_size_id_foreign');
        });
    }
};
