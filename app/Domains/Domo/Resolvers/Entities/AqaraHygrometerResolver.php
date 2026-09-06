<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Hygrometer;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class AqaraHygrometerResolver extends SlugSuffixEntityResolver
{
    protected function domain(): string
    {
        return 'sensor';
    }

    protected function suffix(): string
    {
        return 'humidite';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Hygrometer
    {
        return new Hygrometer(
            id: $entity->id,
            value: (float) $entity->state->value,
            unit: $entity->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}
