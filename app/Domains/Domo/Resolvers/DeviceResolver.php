<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Device;
use App\Domains\Domo\Models\EntityWithState;
use App\Models\DomoDevice;
use Illuminate\Support\Collection;

interface DeviceResolver
{
    public function supports(DomoDevice $device, Collection $entitiesWithStates): bool;

    /**
     * @param  Collection<int, EntityWithState>  $entitiesWithStates
     */
    public function resolve(DomoDevice $device, Collection $entitiesWithStates): Device;
}
