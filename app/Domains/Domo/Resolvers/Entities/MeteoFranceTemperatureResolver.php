<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Thermometer;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceTemperatureResolver implements EntityResolver
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $entity->domain === 'sensor'
            && str_ends_with($entity->ha_id, '_temperature');
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
