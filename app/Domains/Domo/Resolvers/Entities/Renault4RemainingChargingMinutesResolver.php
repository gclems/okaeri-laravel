<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\IntegerValue;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class Renault4RemainingChargingMinutesResolver extends SlugSuffixEntityResolver
{
    protected function domain(): string
    {
        return 'sensor';
    }

    protected function suffix(): string
    {
        return 'temps_de_charge_restant';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): IntegerValue
    {
        return new IntegerValue(
            id: $entity->id,
            value: (int) $entity->state->value,
        );
    }
}
