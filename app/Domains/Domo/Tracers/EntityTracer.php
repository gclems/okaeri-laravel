<?php

namespace App\Domains\Domo\Tracers;

use App\Models\DomoDevice;
use App\Models\DomoEntity;

/**
 * Defines what is traced in the domo_entity_events journal for a type of entity,
 * mirroring an entity resolver. The state value is always traced, only the
 * returned attributes are traced along.
 */
interface EntityTracer
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool;

    /**
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    public function tracedAttributes(array $attributes): array;
}
