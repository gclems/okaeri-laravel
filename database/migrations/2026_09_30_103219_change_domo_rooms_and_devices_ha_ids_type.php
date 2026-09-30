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
            $table->string('ha_id')->change();
        });

        Schema::table('domo_devices', function (Blueprint $table) {
            $table->string('ha_id')->change();
            $table->string('ha_area_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('domo_rooms', function (Blueprint $table) {
            $table->unsignedBigInteger('ha_id')->change();
        });

        Schema::table('domo_devices', function (Blueprint $table) {
            $table->unsignedBigInteger('ha_id')->change();
            $table->foreignId('ha_area_id')->nullable()->change();
        });
    }
};
