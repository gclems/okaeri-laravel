<?php

namespace App\Domains\Domo\Tracers;

use App\Domains\Domo\Resolvers\Entities\Renault4RemainingChargingMinutesResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class Renault4RemainingChargingMinutesTracer implements EntityTracer
{
    public function __construct(
        private Renault4RemainingChargingMinutesResolver $resolver
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
