<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTalentsTable extends Migration
{
    public function up()
    {
        Schema::table('talents', function (Blueprint $table) {
            $table->foreignId('team_id')->nullable()->constrained();
        });
    }

    public function down()
    {
        Schema::table('talents', function (Blueprint $table) {
            $table->dropForeign('talents_team_id_foreign');
        });
    }
}
