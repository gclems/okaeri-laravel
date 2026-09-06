<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\IntegerValue;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceUvIndexResolver implements EntityResolver
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $entity->domain === 'sensor'
            && str_ends_with($entity->ha_id, '_uv');
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): IntegerValue
    {
        return new IntegerValue(
            id: $entity->id,
            value: (int) $entity->state->value,
        );
    }
}
