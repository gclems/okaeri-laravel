<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;

final class MoveHomeAssistantDeviceAction
{
    public function __construct(
        private HAWSClient $hawsClient
    ) {}

    public function execute(string $device_ha_id, ?string $area_ha_id): void
    {
        $this->hawsClient->requestOnce([
            'type' => 'config/device_registry/update',
            'device_id' => $device_ha_id,
            'area_id' => $area_ha_id ?? null,
        ]);
    }
}