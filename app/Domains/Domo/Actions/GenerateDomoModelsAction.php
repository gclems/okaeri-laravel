<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Models\Device;
use App\Domains\Domo\Models\EntityWithState;
use App\Domains\Domo\Resolvers\GeneralDeviceResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;
use App\Models\DomoEntityState;
use Illuminate\Support\Collection;

final class GenerateDomoModelsAction
{
    public function __construct(
        private readonly GeneralDeviceResolver $generalDeviceResolver,
    ) {}

    /**
     * @return Collection<int, Device>
     */
    public function execute(): Collection
    {
        $devices = DomoDevice::all();
        $entities = DomoEntity::all();
        $states = DomoEntityState::all();

        $entitiesWithStates = EntityWithState::pair($entities, $states);

        $results = collect();
        foreach ($devices as $device) {
            if ($this->generalDeviceResolver->supports($device, $entitiesWithStates)) {
                $results->push($this->generalDeviceResolver->resolve($device, $entitiesWithStates));
            }
        }

        return $results;
    }
}
