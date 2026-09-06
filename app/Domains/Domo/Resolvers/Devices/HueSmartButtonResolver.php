<?php

namespace App\Domains\Domo\Resolvers\Devices;

use App\Domains\Domo\Models\Devices\SwitchDevice;
use App\Domains\Domo\Resolvers\Entities\BatteryResolver;
use App\Models\DomoDevice;

final class HueSmartButtonResolver implements DeviceResolver
{
    public function __construct(
        private readonly BatteryResolver $batteryResolver,
    ) {}

    public function supports(DomoDevice $device): bool
    {
        return $device->manufacturer === 'Signify Netherlands B.V.'
            && $device->model === 'ROM001';
    }

    public function resolve(DomoDevice $device): SwitchDevice
    {
        $batteryEntity = null;

        $device->entities->each(function ($entity) use ($device, &$batteryEntity) {
            if (! $batteryEntity && $this->batteryResolver->supports($entity, $device)) {
                $batteryEntity = $this->batteryResolver->resolve($entity, $device);
            }
        });

        return new SwitchDevice(
            $device->id,
            $device->name,
            $device->is_active,
            $batteryEntity,
            $device->room?->id,
        );
    }
}
