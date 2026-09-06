<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\BooleanValue;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class Renault4ChargingResolver extends SlugSuffixEntityResolver
{
    private array $trueValues = [
        'charge_in_progress',
    ];

    protected function domain(): string
    {
        return 'sensor';
    }

    protected function suffix(): string
    {
        return 'etat_de_charge';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): BooleanValue
    {
        return new BooleanValue(
            id: $entity->id,
            value: in_array($entity->state->value, $this->trueValues, true),
        );
    }
}
