<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Events\DeviceUpdated;
use App\Domains\Domo\Resolvers\Devices\GeneralDeviceResolver;
use App\Models\DomoEntityState;

final class GenerateDomoDeviceProjectionFromStateAction
{
    public function __construct(private GeneralDeviceResolver $generalResolver) {}

    public function execute(DomoEntityState $state): void
    {
        $entity = $state->entity;

        if ($entity === null) {
            return;
        }

        $projectedDevice = $this->generalResolver->resolve($entity->device);

        DeviceUpdated::dispatch($projectedDevice);
    }
}
