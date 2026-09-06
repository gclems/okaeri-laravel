<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Battery;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class Renault4TargetChargeResolver extends SlugSuffixEntityResolver
{
    protected function domain(): string
    {
        return 'number';
    }

    protected function suffix(): string
    {
        return 'target_charge_level';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): Battery
    {
        return new Battery(
            id: $entity->id,
            value: (float) $entity->state->value,
        );
    }
}
