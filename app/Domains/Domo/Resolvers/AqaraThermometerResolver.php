<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\EntityWithState;
use App\Domains\Domo\Models\Thermometer;
use App\Models\DomoDevice;

final class AqaraThermometerResolver implements EntityResolver
{
    public function supports(EntityWithState $entityAndState): bool
    {
        $entity = $entityAndState->entity;
        $idParts = explode('_', $entity->ha_id);

        return $entity->domain === 'sensor'
            && end($idParts) === 'temperature';
    }

    public function resolve(EntityWithState $entityAndState, DomoDevice $device): Thermometer
    {
        return new Thermometer(
            id: $entityAndState->entity->id,
            value: (float) $entityAndState->state->state,
            unit: $entityAndState->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}
