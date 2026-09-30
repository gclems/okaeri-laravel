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
        Schema::create('domo_device_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('domo_device_id')->constrained('domo_devices');
            $table->string('kind');
            $table->string('value');
            $table->timestamp('occurred_at');

            $table->index('occurred_at');
            $table->index(['domo_device_id', 'kind', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domo_device_events');
    }
};
