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
        Schema::create('social_media', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();

            $table->uuidMorphs('social_mediaable');

            $table->unsignedBigInteger('social_media_type_id')->nullable();
            $table->foreign('social_media_type_id')->references('id')->on('social_media_types');

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
        Schema::table('social_media', function (Blueprint $table) {
            $table->dropForeign('social_media_social_media_type_id_foreign');
        });
        Schema::dropIfExists('social_media');
    }
};
