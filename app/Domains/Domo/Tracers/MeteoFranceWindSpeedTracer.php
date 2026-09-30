<?php

namespace App\Domains\Domo\Tracers;

use App\Domains\Domo\Resolvers\Entities\MeteoFranceWindSpeedResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;
use Illuminate\Support\Arr;

final class MeteoFranceWindSpeedTracer implements EntityTracer
{
    public function __construct(
        private MeteoFranceWindSpeedResolver $resolver
    ) {}

    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $this->resolver->supports($entity, $device);
    }

    public function tracedAttributes(array $attributes): array
    {
        return Arr::only($attributes, ['unit_of_measurement']);
    }
}
