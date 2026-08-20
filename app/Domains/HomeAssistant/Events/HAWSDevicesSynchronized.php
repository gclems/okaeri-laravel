<?php

namespace App\Domains\HomeAssistant\Events;

use App\Domains\HomeAssistant\DTO\HomeAssistantDevice;

final class HAWSDevicesSynchronized extends HAWSEvent
{
    /**
     * @param  HomeAssistantDevice[]  $devices
     */
    public function __construct(
        array $devices,
    ) {
        parent::__construct('devices_synchronized', $devices);
    }
}
