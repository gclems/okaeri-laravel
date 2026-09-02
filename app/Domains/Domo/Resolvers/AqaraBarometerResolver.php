<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Barometer;
use App\Domains\Domo\Models\EntityWithState;
use App\Models\DomoDevice;

final class AqaraBarometerResolver implements EntityResolver
{
    public function supports(EntityWithState $entityAndState): bool
    {
        $entity = $entityAndState->entity;
        $idParts = explode('_', $entity->ha_id);

        return $entity->domain === 'sensor'
            && end($idParts) === 'pression';
    }

    public function resolve(EntityWithState $entityAndState, DomoDevice $device): Barometer
    {
        return new Barometer(
            id: $entityAndState->entity->id,
            value: (float) $entityAndState->state->state,
            unit: $entityAndState->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}
