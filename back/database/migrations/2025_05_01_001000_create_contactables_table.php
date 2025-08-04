<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contactables', function (Blueprint $table) {
            $table->uuid('contact_id');
            $table->foreign('contact_id')->references('id')->on('contacts');
            $table->uuid('contactable_id');
            $table->string('contactable_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contactables');
    }
};
