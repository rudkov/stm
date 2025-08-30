<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_talent', function (Blueprint $table) {
            $table->foreignUuid('event_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('talent_id')->constrained('talents')->onDelete('cascade');

            $table->decimal('cost', total: 9, places: 2)->nullable();

            $table->primary(['event_id', 'talent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_talent');
    }
};
