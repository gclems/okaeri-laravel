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
        Schema::create('domo_entity_state_histories', function (Blueprint $table) {
            $table->id();
            $table->string('ha_entity_id');
            $table->string('value');
            $table->json('attributes');
            $table->json('raw')->nullable();
            $table->timestamps();

            $table->index(['ha_entity_id', 'updated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domo_entity_state_histories');
    }
};
