<?php

namespace Database\Factories;

use App\Models\DomoDevice;
use App\Models\DomoEntity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DomoEntity>
 */
class DomoEntityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ha_id' => 'light.'.fake()->unique()->slug(2),
            'ha_device_id' => fn () => DomoDevice::factory()->create()->ha_id,
            'name' => fake()->words(2, true),
            'platform' => 'hue',
        ];
    }

    public function domain(string $domain): static
    {
        return $this->state(fn () => [
            'ha_id' => $domain.'.'.fake()->unique()->slug(2),
        ]);
    }
}
