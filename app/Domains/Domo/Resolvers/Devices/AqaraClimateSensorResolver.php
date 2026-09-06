<?php

namespace App\Domains\Domo\Resolvers\Devices;

use App\Domains\Domo\Models\Devices\ClimateSensor;
use App\Domains\Domo\Resolvers\Entities\AqaraBarometerResolver;
use App\Domains\Domo\Resolvers\Entities\AqaraHygrometerResolver;
use App\Domains\Domo\Resolvers\Entities\AqaraThermometerResolver;
use App\Domains\Domo\Resolvers\Entities\BatteryResolver;
use App\Models\DomoDevice;

final class AqaraClimateSensorResolver implements DeviceResolver
{
    public function __construct(
        private readonly AqaraBarometerResolver $barometerResolver,
        private readonly AqaraHygrometerResolver $hygrometerResolver,
        private readonly AqaraThermometerResolver $thermometerResolver,
        private readonly BatteryResolver $batteryResolver,
    ) {}

    public function supports(DomoDevice $device): bool
    {
        return $device->manufacturer === 'LUMI'
            && $device->model === 'lumi.sensor_ht.agl02';
    }

    public function resolve(DomoDevice $device): ClimateSensor
    {
        $barometerEntity = null;
        $hygrometerEntity = null;
        $thermometerEntity = null;
        $batteryEntity = null;

        $device->entities->each(function ($entity) use ($device, &$barometerEntity, &$hygrometerEntity, &$thermometerEntity, &$batteryEntity) {
            if (! $barometerEntity && $this->barometerResolver->supports($entity, $device)) {
                $barometerEntity = $this->barometerResolver->resolve($entity, $device);
            } elseif (! $hygrometerEntity && $this->hygrometerResolver->supports($entity, $device)) {
                $hygrometerEntity = $this->hygrometerResolver->resolve($entity, $device);
            } elseif (! $thermometerEntity && $this->thermometerResolver->supports($entity, $device)) {
                $thermometerEntity = $this->thermometerResolver->resolve($entity, $device);
            } elseif (! $batteryEntity && $this->batteryResolver->supports($entity, $device)) {
                $batteryEntity = $this->batteryResolver->resolve($entity, $device);
            }
        });

        return new ClimateSensor(
            $device->id,
            $device->name,
            $device->is_active,
            $device->room?->id,
            $batteryEntity,
            $thermometerEntity,
            $hygrometerEntity,
            $barometerEntity,
        );
    }
}
