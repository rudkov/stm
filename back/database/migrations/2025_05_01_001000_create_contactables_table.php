<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contactables', function (Blueprint $table) {
            $table->foreignUuid('contact_id')->constrained()->onDelete('cascade');
            $table->uuidMorphs('contactable');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contactables');
    }
};
