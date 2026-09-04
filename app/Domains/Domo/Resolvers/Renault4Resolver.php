<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Renault4;
use App\Models\DomoDevice;

final class Renault4Resolver implements DeviceResolver
{
    public function __construct(
    ) {}

    public function supports(DomoDevice $device): bool
    {
        return false;
        throw new \LogicException('Not implemented yet');
    }

    public function resolve(DomoDevice $device): Renault4
    {
        throw new \LogicException('Not implemented yet');
    }
}
