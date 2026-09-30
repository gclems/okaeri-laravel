<?php

namespace App\Domains\HomeAssistant\Events;

use App\Domains\HomeAssistant\DTO\HomeAssistantDevice;

/**
 * @extends HAWSEvent<HomeAssistantDevice>
 */
final class HAWSDevicesSynchronized extends HAWSEvent
{
    /**
     * @param  array<array-key, HomeAssistantDevice>  $devices
     */
    public function __construct(
        array $devices,
    ) {
        parent::__construct('devices_synchronized', $devices);
    }
}
