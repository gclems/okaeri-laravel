<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Device;
use App\Domains\Domo\Models\EntityWithState;
use App\Models\DomoDevice;
use App\Models\DomoRoom;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

interface DeviceResolver
{
    public function supports(DomoDevice $device, Collection $entitiesWithStates): bool;

    /**
     * @param  Collection<int, EntityWithState>  $entitiesWithStates
     * @param  EloquentCollection<int, DomoRoom>  $rooms
     */
    public function resolve(DomoDevice $device, Collection $entitiesWithStates, EloquentCollection $rooms): Device;
}
