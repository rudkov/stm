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
        Schema::create('talent_relatives', function (Blueprint $table) {
            $table->id();
            $table->uuid('talent_id');
            $table->foreign('talent_id')->references('id')->on('talents');
            $table->unsignedBigInteger('relative_type_id')->nullable();
            $table->foreign('relative_type_id')->references('id')->on('talent_relative_types');
            $table->text('info')->nullable();
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
        Schema::dropIfExists('talent_relatives');
    }
};
