<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Resolvers\GeneralDeviceResolver;
use App\Models\DomoEntityState;

final class GenerateDomoDeviceProjectionAction
{
    public function __construct(private GeneralDeviceResolver $generalResolver) {}

    public function execute(DomoEntityState $state): void
    {
        $entity = $state->entity;
        $device = $entity->device;

        $this->generalResolver->resolveSingle($device, $entity, $state);
    }
}