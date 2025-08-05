<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messenger_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('url');
            $table->string('system_name')->unique();
            $table->softDeletes();
            $table->timestamps();

            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messenger_types');
    }
};
