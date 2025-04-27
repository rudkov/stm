<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventTalentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('event_talent', function (Blueprint $table) {
            $table->uuid('event_id')->nullable();
            $table->foreign('event_id')->references('id')->on('events');
            $table->uuid('talent_id')->nullable();
            $table->foreign('talent_id')->references('id')->on('talents');
            $table->decimal('cost', total: 9, places: 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('event_talent');
    }
}
