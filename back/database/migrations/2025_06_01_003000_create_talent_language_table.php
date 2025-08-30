<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talent_language', function (Blueprint $table) {
            $table->foreignUuid('talent_id')->constrained('talents')->onDelete('cascade');
            
            $table->char('language_id', 2);
            $table->foreign('language_id')->references('id')->on('languages')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talent_language');
    }
};
