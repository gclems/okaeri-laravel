<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\LightBulb;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class HueLightBulbResolver implements DeviceResolver
{
    public function __construct(
        private readonly HueLightStateResolver $lightStateResolver,
    ) {}

    public function supports(DomoDevice $device): bool
    {
        if (! $this->isHueDevice($device)) {
            return false;
        }

        return $device->entities->contains(
            fn (DomoEntity $entity) => $this->lightStateResolver->supports($entity)
        );
    }

    public function resolve(DomoDevice $device): LightBulb
    {
        $entity = $device->entities->first(
            fn (DomoEntity $entity) => $this->lightStateResolver->supports($entity)
        );

        if ($entity === null) {
            throw new \RuntimeException("No light entity found for Hue light bulb device [{$device->id}]");
        }

        return new LightBulb(
            $device->id,
            $device->name,
            $device->is_active,
            $this->lightStateResolver->resolve($entity, $device),
            $device->room?->id,
        );
    }

    private function isHueDevice(DomoDevice $device): bool
    {
        return $device->manufacturer !== null
            && (str_contains(strtolower($device->manufacturer), 'philips')
                || str_contains(strtolower($device->manufacturer), 'signify'));
    }
}
