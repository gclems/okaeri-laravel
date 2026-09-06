<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\BooleanValue;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class Renault4PluggedResolver extends SlugSuffixEntityResolver
{
    private array $trueValues = [
        'plugged',
        'plugged_waiting_for_charge',
    ];

    protected function domain(): string
    {
        return 'sensor';
    }

    protected function suffix(): string
    {
        return 'etat_du_branchement';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): BooleanValue
    {
        return new BooleanValue(
            id: $entity->id,
            value: in_array($entity->state->value, $this->trueValues, true),
        );
    }
}
