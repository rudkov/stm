<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_media', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();

            $table->unsignedBigInteger('social_media_type_id')->nullable();
            $table->foreign('social_media_type_id')->references('id')->on('social_media_types');

            $table->uuidMorphs('social_mediaable');
        });
    }

    public function down(): void
    {
        Schema::table('social_media', function (Blueprint $table) {
            $table->dropForeign('social_media_social_media_type_id_foreign');
        });
        Schema::dropIfExists('social_media');
    }
};
