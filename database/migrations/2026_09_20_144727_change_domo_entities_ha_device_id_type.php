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
        Schema::table('domo_entities', function (Blueprint $table) {
            $table->string('ha_device_id')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('domo_entities', function (Blueprint $table) {
            $table->foreignId('ha_device_id')->change();
        });
    }
};
