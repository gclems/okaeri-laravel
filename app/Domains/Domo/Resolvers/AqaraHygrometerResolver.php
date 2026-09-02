<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\EntityWithState;
use App\Domains\Domo\Models\Hygrometer;
use App\Models\DomoDevice;

final class AqaraHygrometerResolver implements EntityResolver
{
    public function supports(EntityWithState $entityAndState): bool
    {
        $entity = $entityAndState->entity;
        $idParts = explode('_', $entity->ha_id);

        return $entity->domain === 'sensor'
            && end($idParts) === 'humidite';
    }

    public function resolve(EntityWithState $entityAndState, DomoDevice $device): Hygrometer
    {
        return new Hygrometer(
            id: $entityAndState->entity->id,
            value: (float) $entityAndState->state->state,
            unit: $entityAndState->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}
