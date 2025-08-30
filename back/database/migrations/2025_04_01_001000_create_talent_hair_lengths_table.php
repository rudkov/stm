<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talent_hair_lengths', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->tinyInteger('sort_order')->unsigned()->index();
            $table->softDeletes();
            $table->timestamps();

            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talent_hair_lengths');
    }
};
