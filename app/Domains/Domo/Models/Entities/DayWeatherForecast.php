<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class DayWeatherForecast extends Entity
{
    public function __construct(
        int $id,
        public readonly string $date,
        public readonly ?WeatherConditionType $condition,
        public readonly ?float $temperature,
        public readonly ?float $temperatureLow,
        public readonly ?string $temperatureUnit,
        public readonly ?int $humidity,
    ) {
        parent::__construct(
            $id,
        );
    }
}
