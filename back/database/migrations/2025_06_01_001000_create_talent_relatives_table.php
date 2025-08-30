<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talent_relatives', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();

            $table->foreignUuid('talent_id')->constrained('talents')->onDelete('cascade');
            $table->foreignId('relative_type_id')->nullable()->constrained('talent_relative_types')->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talent_relatives');
    }
};
