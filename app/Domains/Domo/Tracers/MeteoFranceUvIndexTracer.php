<?php

namespace App\Domains\Domo\Tracers;

use App\Domains\Domo\Resolvers\Entities\MeteoFranceUvIndexResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceUvIndexTracer implements EntityTracer
{
    public function __construct(
        private MeteoFranceUvIndexResolver $resolver
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
