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
        Schema::create('emails', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();

            $table->unsignedBigInteger('email_type_id')->nullable();
            $table->foreign('email_type_id')->references('id')->on('email_types');

            $table->uuidMorphs('emailable');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('emails', function (Blueprint $table) {
            $table->dropForeign('emails_email_type_id_foreign');
        });
        Schema::dropIfExists('emails');
    }
};
