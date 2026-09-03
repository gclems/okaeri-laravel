<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\EntityWithState;
use App\Domains\Domo\Models\LightBulb;
use App\Models\DomoDevice;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

final class HueLightBulbResolver implements DeviceResolver
{
    public function __construct(
        private readonly HueLightStateResolver $lightStateResolver,
    ) {}

    public function supports(DomoDevice $device, Collection $entitiesWithStates): bool
    {
        if (! $this->isHueDevice($device)) {
            return false;
        }

        return $entitiesWithStates->contains(
            fn (EntityWithState $pair) => $pair->belongsTo($device)
                && $this->lightStateResolver->supports($pair)
        );
    }

    public function resolve(DomoDevice $device, Collection $entitiesWithStates, EloquentCollection $rooms): LightBulb
    {
        if (! $this->supports($device, $entitiesWithStates)) {
            throw new \InvalidArgumentException('Device is not a Hue light');
        }

        $pair = $entitiesWithStates->first(
            fn (EntityWithState $pair) => $pair->entity->ha_device_id === $device->ha_id
                && $this->lightStateResolver->supports($pair)
        );

        if ($pair === null) {
            throw new \RuntimeException("No light entity found for Hue light bulb device [{$device->id}]");
        }

        $roomId = null;
        if (isset($device->ha_area_id)) {
            $roomId = $rooms->firstWhere('ha_id', $device->ha_area_id)?->id;
        }

        return new LightBulb(
            $device->id,
            $device->name,
            $device->is_active,
            $this->lightStateResolver->resolve($pair, $device),
            $roomId,
        );
    }

    private function isHueDevice(DomoDevice $device): bool
    {
        return $device->manufacturer !== null
            && (str_contains(strtolower($device->manufacturer), 'philips')
                || str_contains(strtolower($device->manufacturer), 'signify'));
    }
}
