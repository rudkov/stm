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
        Schema::create('messengers', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();

            $table->unsignedBigInteger('messenger_type_id')->nullable();
            $table->foreign('messenger_type_id')->references('id')->on('messenger_types');

            $table->uuidMorphs('messengerable');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('messengers', function (Blueprint $table) {
            $table->dropForeign('messengers_messenger_type_id_foreign');
        });
        Schema::dropIfExists('messengers');
    }
};
