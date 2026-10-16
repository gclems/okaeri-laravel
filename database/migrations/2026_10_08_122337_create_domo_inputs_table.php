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
        Schema::create('domo_inputs', function (Blueprint $table) {
            $table->id();
            $table->string('ha_entity_id')->unique();
            $table->text('value');
            $table->json('attributes');
            $table->json('raw');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domo_inputs');
    }
};
