<?php

namespace App\Domains\Domo\Tracers;

use App\Domains\Domo\Resolvers\Entities\MeteoFranceWeatherConditionResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceWeatherConditionTracer implements EntityTracer
{
    public function __construct(
        private MeteoFranceWeatherConditionResolver $resolver
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
