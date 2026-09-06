<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Thermometer;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class AqaraThermometerResolver extends SlugSuffixEntityResolver
{
    protected function domain(): string
    {
        return 'sensor';
    }

    protected function suffix(): string
    {
        return 'temperature';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Thermometer
    {
        return new Thermometer(
            id: $entity->id,
            value: (float) $entity->state->value,
            unit: $entity->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}
