<?php

namespace App\Domains\Domo\Tracers;

use App\Domains\Domo\Resolvers\Entities\AqaraHygrometerResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;
use Illuminate\Support\Arr;

final class AqaraHygrometerTracer implements EntityTracer
{
    public function __construct(
        private AqaraHygrometerResolver $resolver
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
