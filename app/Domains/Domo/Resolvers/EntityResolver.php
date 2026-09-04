<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Entity;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

interface EntityResolver
{
    public function supports(DomoEntity $entity): bool;

    public function resolve(DomoEntity $entity, DomoDevice $device): Entity;
}
