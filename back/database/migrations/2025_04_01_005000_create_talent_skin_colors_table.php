<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talent_skin_colors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('system_name')->unique();
            $table->softDeletes();
            $table->timestamps();

            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talent_skin_colors');
    }
};
