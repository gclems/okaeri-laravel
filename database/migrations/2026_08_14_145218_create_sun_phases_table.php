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
        Schema::create('sun_phases', function (Blueprint $table) {
            $table->id();

            $table->date('date')->unique();
            $table->dateTime('sunrise_starts_at');
            $table->decimal('sunrise_azimuth', 8, 2);
            $table->dateTime('sunset_starts_at');
            $table->decimal('sunset_azimuth', 8, 2);
            $table->dateTime('solar_noon_at');
            $table->decimal('solar_noon_disc_centre_elevation', 8, 2);
            $table->dateTime('solar_midnight_at');
            $table->decimal('solar_midnight_disc_centre_elevation', 8, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sun_phases');
    }
};
