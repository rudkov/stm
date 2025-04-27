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
        Schema::create('talent_addresses', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();

            $table->uuid('talent_id');
            $table->foreign('talent_id')->references('id')->on('talents');

            $table->unsignedBigInteger('address_type_id')->nullable();
            $table->foreign('address_type_id')->references('id')->on('address_types');
        
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
        Schema::dropIfExists('talent_addresses');
    }
};
