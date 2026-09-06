<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Barometer;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class AqaraBarometerResolver extends SlugSuffixEntityResolver
{
    protected function domain(): string
    {
        return 'sensor';
    }

    protected function suffix(): string
    {
        return 'pression';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Barometer
    {
        return new Barometer(
            id: $entity->id,
            value: (float) $entity->state->value,
            unit: $entity->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}
