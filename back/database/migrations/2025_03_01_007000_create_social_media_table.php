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

            $table->foreignId('social_media_type_id')->nullable()->constrained()->onDelete('restrict');

            $table->uuidMorphs('social_mediaable');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_media');
    }
};
