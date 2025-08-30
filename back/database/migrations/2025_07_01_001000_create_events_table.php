<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('notes')->nullable();

            $table->foreignId('team_id')->nullable()->constrained()->onDelete('set null'); // TODO: remove nullable
            $table->foreignId('event_type_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignUuid('client_id')->nullable()->constrained('companies')->onDelete('set null');

            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');

            $table->softDeletes();
            $table->timestamps();

            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
