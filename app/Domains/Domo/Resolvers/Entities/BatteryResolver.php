<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Battery;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class BatteryResolver extends SlugSuffixEntityResolver
{
    protected function domain(): string
    {
        return 'sensor';
    }

    protected function suffix(): string
    {
        return 'batterie';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Battery
    {
        return new Battery(
            id: $entity->id,
            value: (float) $entity->state->value,
        );
    }
}
