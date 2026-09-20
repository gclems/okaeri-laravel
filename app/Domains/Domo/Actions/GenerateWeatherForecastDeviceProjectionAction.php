<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Events\DeviceUpdated;
use App\Domains\Domo\Resolvers\Devices\MeteoFranceWeatherForecastResolver;
use App\Models\DomoDevice;

final class GenerateWeatherForecastDeviceProjectionAction
{
    public function __construct(
        private readonly MeteoFranceWeatherForecastResolver $resolver,
    ) {}

    public function execute(string $haDeviceId): void
    {
        $device = DomoDevice::with(['entities.state', 'room'])
            ->where('ha_id', $haDeviceId)
            ->first();

        if ($device === null || ! $this->resolver->supports($device)) {
            return;
        }

        $projectedDevice = $this->resolver->resolve($device);

        DeviceUpdated::dispatch($projectedDevice);
    }
}
