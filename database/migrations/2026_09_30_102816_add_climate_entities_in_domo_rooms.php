<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('domo_rooms', function (Blueprint $table) {
            $table->string('ha_temperature_entity_id')->nullable();
            $table->string('ha_humidity_entity_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('domo_rooms', function (Blueprint $table) {
            $table->dropColumn(['ha_temperature_entity_id', 'ha_humidity_entity_id']);
        });
    }
};
