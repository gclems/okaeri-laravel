<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\WeatherAlert;
use App\Domains\Domo\Models\Entities\WeatherAlertLevel;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class MeteoFranceWeatherAlertResolver implements EntityResolver
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return $entity->domain === 'sensor'
            && str_ends_with($entity->ha_id, '_weather_alert');
    }

    public function resolve(DomoEntity $entity, DomoDevice $device): WeatherAlert
    {
        $attributes = $entity->state->attributes ?? [];

        $risks = collect($attributes)
            ->filter(fn (mixed $value) => is_string($value))
            ->mapWithKeys(fn (string $value, string $name) => [$name => WeatherAlertLevel::tryFrom($value)])
            ->filter()
            ->all();

        return new WeatherAlert(
            id: $entity->id,
            level: WeatherAlertLevel::tryFrom($entity->state->value ?? ''),
            risks: $risks,
        );
    }
}
