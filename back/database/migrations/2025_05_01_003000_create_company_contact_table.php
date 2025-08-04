<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_contact', function (Blueprint $table) {
            $table->uuid('company_id');
            $table->foreign('company_id')->references('id')->on('companies');
            $table->uuid('contact_id');
            $table->foreign('contact_id')->references('id')->on('contacts');
            $table->string('job_title')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_contact');
    }
};
