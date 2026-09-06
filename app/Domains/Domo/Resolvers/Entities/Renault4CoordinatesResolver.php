<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Coordinates;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class Renault4CoordinatesResolver extends SlugSuffixEntityResolver
{
    protected function domain(): string
    {
        return 'device_tracker';
    }

    protected function suffix(): string
    {
        return 'emplacement';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Coordinates
    {
        return new Coordinates(
            id: $entity->id,
            latitude: $entity->state->attributes['latitude'],
            longitude: $entity->state->attributes['longitude'],
        );
    }
}
