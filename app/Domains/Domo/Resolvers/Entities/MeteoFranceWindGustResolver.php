<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\WindSpeed;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceWindGustResolver implements EntityResolver
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $entity->domain === 'sensor'
            && str_ends_with($entity->ha_id, '_wind_gust');
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): WindSpeed
    {
        return new WindSpeed(
            id: $entity->id,
            value: (float) $entity->state->value,
            unit: $entity->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}
