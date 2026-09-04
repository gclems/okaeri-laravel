<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Battery;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class AqaraBatteryResolver implements EntityResolver
{
    public function supports(DomoEntity $entity): bool
    {
        $idParts = explode('_', $entity->ha_id);

        return $entity->domain === 'sensor'
            && end($idParts) === 'batterie';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Battery
    {
        return new Battery(
            id: $entity->id,
            value: (float) $entity->state->value,
            unit: $entity->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}