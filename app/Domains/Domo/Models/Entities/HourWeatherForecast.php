<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class HourWeatherForecast extends Entity
{
    public function __construct(
        int $id,
        public readonly string $date,
        public readonly ?WeatherConditionType $condition,
        public readonly ?float $temperature,
        public readonly ?string $temperatureUnit,
        public readonly ?int $humidity,
    ) {
        parent::__construct(
            $id,
        );
    }
}
