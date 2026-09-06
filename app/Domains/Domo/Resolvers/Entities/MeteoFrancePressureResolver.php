<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Barometer;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFrancePressureResolver implements EntityResolver
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $entity->domain === 'sensor'
            && str_ends_with($entity->ha_id, '_pressure');
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
