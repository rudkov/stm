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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();

            $table->unsignedBigInteger('address_type_id')->nullable();
            $table->foreign('address_type_id')->references('id')->on('address_types');

            $table->uuidMorphs('addressable');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropForeign('addresses_address_type_id_foreign');
        });
        Schema::dropIfExists('addresses');
    }
};
