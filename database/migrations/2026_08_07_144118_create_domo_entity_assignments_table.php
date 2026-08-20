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
        Schema::create('domo_entity_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('domo_entity_id')->unique();
            $table->foreignId('domo_room_id')->nullable(true);
            $table->string('role');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domo_entity_assignments');
    }
};
