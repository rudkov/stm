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
        Schema::create('phones', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();
            
            $table->unsignedBigInteger('phone_type_id')->nullable();
            $table->foreign('phone_type_id')->references('id')->on('phone_types');
            
            $table->uuidMorphs('phoneable');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('phones', function (Blueprint $table) {
            $table->dropForeign('phones_phone_type_id_foreign');
        });
        Schema::dropIfExists('phones');
    }
};
