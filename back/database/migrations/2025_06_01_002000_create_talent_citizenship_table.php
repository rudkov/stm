<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talent_citizenship', function (Blueprint $table) {
            $table->uuid('talent_id');
            $table->foreign('talent_id')->references('id')->on('talents');
            $table->char('citizenship_id', 2);
            $table->foreign('citizenship_id')->references('alpha_2')->on('countries');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talent_citizenship');
    }
};
