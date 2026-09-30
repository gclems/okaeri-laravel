<?php

namespace App\Domains\Domo\Tracers;

use App\Domains\Domo\Models\Entities\WeatherAlertLevel;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceWeatherAlertResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceWeatherAlertTracer implements EntityTracer
{
    public function __construct(
        private MeteoFranceWeatherAlertResolver $resolver
    ) {}

    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $this->resolver->supports($entity, $device);
    }

    public function tracedAttributes(array $attributes): array
    {
        return array_filter(
            $attributes,
            fn (mixed $value) => is_string($value) && WeatherAlertLevel::tryFrom($value) !== null,
        );
    }
}
