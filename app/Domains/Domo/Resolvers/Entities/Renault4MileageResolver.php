<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Distance;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class Renault4MileageResolver extends SlugSuffixEntityResolver
{
    protected function domain(): string
    {
        return 'sensor';
    }

    protected function suffix(): string
    {
        return 'kilometrage';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Distance
    {
        return new Distance(
            id: $entity->id,
            value: (int) $entity->state->value,
            unit: $entity->state->attributes['unit_of_measurement'] ?? null,
        );
    }
}
