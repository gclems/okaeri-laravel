<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Models\Devices\Device;
use App\Domains\Domo\Resolvers\Devices\GeneralDeviceResolver;
use App\Models\DomoDevice;
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
        $devices = DomoDevice::with(['entities.state', 'room', 'dailyWeatherForecasts', 'hourlyWeatherForecasts'])->get();

        $results = collect();
        foreach ($devices as $device) {
            if ($this->generalDeviceResolver->supports($device)) {
                $results->push($this->generalDeviceResolver->resolve($device));
            }
        }

        return $results;
    }
}
