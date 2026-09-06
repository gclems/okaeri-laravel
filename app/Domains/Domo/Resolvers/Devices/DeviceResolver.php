<?php

namespace App\Domains\Domo\Resolvers\Devices;

use App\Domains\Domo\Models\Devices\Device;
use App\Models\DomoDevice;

interface DeviceResolver
{
    public function supports(DomoDevice $device): bool;

    public function resolve(DomoDevice $device): Device;
}
