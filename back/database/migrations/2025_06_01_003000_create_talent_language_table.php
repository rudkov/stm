<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talent_language', function (Blueprint $table) {
            $table->uuid('talent_id');
            $table->foreign('talent_id')->references('id')->on('talents');
            $table->char('language_id', 2);
            $table->foreign('language_id')->references('id')->on('languages');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talent_language');
    }
};
