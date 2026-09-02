<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Entity;
use App\Domains\Domo\Models\EntityWithState;
use App\Models\DomoDevice;

interface EntityResolver
{
    public function supports(EntityWithState $entityAndState): bool;

    public function resolve(EntityWithState $entityAndState, DomoDevice $device): Entity;
}
