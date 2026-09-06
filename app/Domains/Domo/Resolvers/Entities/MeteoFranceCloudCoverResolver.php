<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Percentage;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceCloudCoverResolver implements EntityResolver
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $entity->domain === 'sensor'
            && str_ends_with($entity->ha_id, '_cloud_cover');
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Percentage
    {
        return new Percentage(
            id: $entity->id,
            value: (float) $entity->state->value,
        );
    }
}
