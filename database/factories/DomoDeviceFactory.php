<?php

namespace Database\Factories;

use App\Models\DomoDevice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DomoDevice>
 */
class DomoDeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ha_id' => fake()->unique()->uuid(),
            'name' => fake()->words(2, true),
            'is_active' => true,
            'is_virtual' => false,
        ];
    }
}
