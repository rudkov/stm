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
        Schema::table('addresses', function (Blueprint $table) {
            $table->foreignId('communication_type_id')
                ->nullable()
                ->constrained('communication_types')
                ->onDelete('set null');
        });
        Schema::table('emails', function (Blueprint $table) {
            $table->foreignId('communication_type_id')
                ->nullable()
                ->constrained('communication_types')
                ->onDelete('set null');
        });
        Schema::table('phones', function (Blueprint $table) {
            $table->foreignId('communication_type_id')
                ->nullable()
                ->constrained('communication_types')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropForeign(['communication_type_id']);
            $table->dropColumn('communication_type_id');
        });
        Schema::table('emails', function (Blueprint $table) {
            $table->dropForeign(['communication_type_id']);
            $table->dropColumn('communication_type_id');
        });
        Schema::table('phones', function (Blueprint $table) {
            $table->dropForeign(['communication_type_id']);
            $table->dropColumn('communication_type_id');
        });
    }
};
