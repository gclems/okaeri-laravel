<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Precipitation;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFrancePrecipitationResolver implements EntityResolver
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $entity->domain === 'sensor'
            && str_ends_with($entity->ha_id, '_daily_precipitation');
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Precipitation
    {
        return new Precipitation(
            id: $entity->id,
            value: (float) $entity->state->value,
            unit: $entity->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}
