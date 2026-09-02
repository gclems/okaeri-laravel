<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\ClimateSensor;
use App\Models\DomoDevice;
use Illuminate\Support\Collection;

final class AquaraClimateSensorResolver implements DeviceResolver
{
    public function __construct(
        private readonly AqaraBarometerResolver $barometerResolver,
        private readonly AqaraHygrometerResolver $hygrometerResolver,
        private readonly AqaraThermometerResolver $thermometerResolver,
    ) {}

    public function supports(DomoDevice $device, Collection $entitiesWithStates): bool
    {
        return false;

        return $device->model === 'lumi.sensor_ht.agl02';
    }

    public function resolve(DomoDevice $device, Collection $entitiesWithStates): ClimateSensor
    {
        throw new \LogicException('Not implemented yet');
    }
}
