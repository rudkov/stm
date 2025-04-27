<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventTypesTable extends Migration
{
    public function up()
    {
        Schema::create('event_types', function (Blueprint $table) {
            $table->id();
            $table->string('system_name');
            $table->string('color_light_theme');
            $table->string('color_dark_theme');
            $table->string('name');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_types');
    }
}
