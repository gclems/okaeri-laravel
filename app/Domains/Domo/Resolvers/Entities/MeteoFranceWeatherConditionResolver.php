<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\WeatherCondition;
use App\Domains\Domo\Models\Entities\WeatherConditionType;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceWeatherConditionResolver implements EntityResolver
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $entity->domain === 'weather';
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): WeatherCondition
    {
        return new WeatherCondition(
            id: $entity->id,
            condition: WeatherConditionType::tryFrom($entity->state->value ?? ''),
        );
    }
}
