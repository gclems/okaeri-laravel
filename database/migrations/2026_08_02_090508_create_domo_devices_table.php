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
        Schema::create('domo_devices', function (Blueprint $table) {
            $table->id();
            $table->string('ha_id')->unique();
            $table->foreignId('ha_area_id')->nullable(true);
            $table->string('name');
            $table->boolean('is_active');
            $table->boolean('is_virtual');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domo_devices');
    }
};
