<?php

namespace Database\Factories;

use App\Models\DomoInput;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DomoInput>
 */
class DomoInputFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ha_entity_id' => 'input_text.'.fake()->unique()->slug(2),
            'value' => fake()->word(),
            'attributes' => [],
            'raw' => [],
        ];
    }
}
