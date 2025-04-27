<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contact_messengers', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();

            $table->uuid('contact_id');
            $table->foreign('contact_id')->references('id')->on('contacts');

            $table->unsignedBigInteger('messenger_type_id')->nullable();
            $table->foreign('messenger_type_id')->references('id')->on('messenger_types');
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_messengers');
    }
};
