<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Device;
use App\Models\DomoDevice;

interface DeviceResolver
{
    public function supports(DomoDevice $device): bool;

    public function resolve(DomoDevice $device): Device;
}
