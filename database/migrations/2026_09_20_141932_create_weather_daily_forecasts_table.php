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
        Schema::create('weather_daily_forecasts', function (Blueprint $table) {
            $table->id();
            $table->string('ha_device_id');
            $table->date('date');
            $table->string('condition');
            $table->decimal('temperature', 5, 2);
            $table->decimal('temperature_low', 5, 2);
            $table->string('temperature_unit');
            $table->unsignedTinyInteger('humidity')->nullable();
            $table->timestamps();

            $table->unique(['ha_device_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weather_daily_forecasts');
    }
};
