<?php

namespace App\Domains\Domo\Resolvers\Devices;

use App\Domains\Domo\Models\Devices\Device;
use App\Models\DomoDevice;

final class GeneralDeviceResolver implements DeviceResolver
{
    /** @var list<DeviceResolver> */
    private readonly array $resolvers;

    public function __construct(
        AqaraClimateSensorResolver $climateSensorResolver,
        HueLightBulbResolver $lightBulbResolver,
        Renault4Resolver $renault4Resolver,
        HueDimmerSwitchResolver $dimmerSwitchResolver,
        HueSmartButtonResolver $smartButtonResolver,
        MeteoFranceWeatherForecastResolver $weatherForecastResolver,
    ) {
        $this->resolvers = [
            $climateSensorResolver,
            $lightBulbResolver,
            $renault4Resolver,
            $dimmerSwitchResolver,
            $smartButtonResolver,
            $weatherForecastResolver,
        ];
    }

    public function supports(DomoDevice $device): bool
    {
        $device->loadMissing(['entities.state', 'room']);

        return $this->findResolver($device) !== null;
    }

    public function resolve(DomoDevice $device): Device
    {
        $device->loadMissing(['entities.state', 'room']);

        $resolver = $this->findResolver($device);

        if ($resolver === null) {
            throw new \RuntimeException("No resolver found for device [{$device->id}]");
        }

        return $resolver->resolve($device);
    }

    private function findResolver(DomoDevice $device): ?DeviceResolver
    {
        return collect($this->resolvers)
            ->first(fn (DeviceResolver $resolver) => $resolver->supports($device));
    }
}
