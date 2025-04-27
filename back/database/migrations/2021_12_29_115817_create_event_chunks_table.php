<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventChunksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_chunks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->uuid('event_id');
            $table->foreign('event_id')->references('id')->on('events');
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
        Schema::dropIfExists('event_chunks');
    }
}
