<?php

namespace App\Domains\HomeAssistant\Synchronizers;

use App\Domains\HomeAssistant\DTO\HomeAssistantDevice;
use App\Domains\HomeAssistant\Events\HAWSDevicesSynchronized;
use App\Domains\HomeAssistant\HAWSClient;

final class HADevicesSynchronizer
{
    public function __construct(
        private HAWSClient $client,
    ) {}

    public function sync(): void
    {
        $devices = $this->client->request([
            'type' => 'config/device_registry/list',
        ]);

        if (! is_array($devices)) {
            throw new \RuntimeException('Home Assistant device registry response is invalid');
        }

        HAWSDevicesSynchronized::dispatch(array_map(
            fn (array $device) => HomeAssistantDevice::fromArray($device),
            $devices
        ));
    }
}
