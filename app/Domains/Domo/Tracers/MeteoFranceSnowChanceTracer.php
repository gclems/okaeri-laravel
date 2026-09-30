<?php

namespace App\Domains\Domo\Tracers;

use App\Domains\Domo\Resolvers\Entities\MeteoFranceSnowChanceResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceSnowChanceTracer implements EntityTracer
{
    public function __construct(
        private MeteoFranceSnowChanceResolver $resolver
    ) {}

    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $this->resolver->supports($entity, $device);
    }

    public function tracedAttributes(array $attributes): array
    {
        return [];
    }
}
