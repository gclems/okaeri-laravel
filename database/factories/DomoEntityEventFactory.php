<?php

namespace Database\Factories;

use App\Models\DomoEntity;
use App\Models\DomoEntityEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DomoEntityEvent>
 */
class DomoEntityEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'domo_entity_id' => DomoEntity::factory(),
            'value' => 'on',
            'attributes' => null,
            'changes' => ['value'],
            'occurred_at' => now(),
        ];
    }
}
