<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talent_shoe_sizes', function (Blueprint $table) {
            $table->id();
            $table->string('size_adult_uk');
            $table->string('size_adult_us_men');
            $table->string('size_adult_us_women');
            $table->tinyInteger('weight')->unsigned()->index();
            $table->softDeletes();
            $table->timestamps();

            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talent_shoe_sizes');
    }
};
