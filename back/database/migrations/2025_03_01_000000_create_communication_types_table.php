<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communication_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->index();
            $table->tinyInteger('sort_order')->index();
            $table->foreignId('team_id')->constrained()->onDelete('cascade');

            $table->unique(['name', 'type', 'team_id']);
            $table->unique(['type', 'sort_order', 'team_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communication_types');
    }
};
