<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->text('info')->nullable();

            $table->foreignId('communication_type_id')->nullable()->constrained()->onDelete('set null');
            
            $table->uuidMorphs('addressable');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
