<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\ElectricMeasurement;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

/**
 * Every ZLinky sensor (energy index, power, current, voltage) shares the same
 * value + unit shape, so a single resolver is parameterized by the entity suffix.
 */
final class ZLinkyMeasurementResolver extends SlugSuffixEntityResolver
{
    public function __construct(
        private readonly string $suffix,
    ) {}

    protected function domain(): string
    {
        return 'sensor';
    }

    protected function suffix(): string
    {
        return $this->suffix;
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): ElectricMeasurement
    {
        $value = $entity->state?->value;

        return new ElectricMeasurement(
            id: $entity->id,
            value: is_numeric($value) ? (float) $value : null,
            unit: $entity->state?->attributes['unit_of_measurement'] ?? null,
        );
    }
}
