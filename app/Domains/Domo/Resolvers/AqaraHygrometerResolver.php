<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Hygrometer;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class AqaraHygrometerResolver implements EntityResolver
{
    public function supports(DomoEntity $entity): bool
    {
        $idParts = explode('_', $entity->ha_id);

        return $entity->domain === 'sensor'
            && end($idParts) === 'humidite';
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
