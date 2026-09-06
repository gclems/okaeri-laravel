<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\Entity;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

interface EntityResolver
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool;

    public function resolve(DomoEntity $entity, DomoDevice $device): Entity;
}
