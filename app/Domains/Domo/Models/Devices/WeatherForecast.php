<?php

namespace App\Domains\Domo\Models\Devices;

use App\Domains\Domo\Models\Entities\Barometer;
use App\Domains\Domo\Models\Entities\Hygrometer;
use App\Domains\Domo\Models\Entities\IntegerValue;
use App\Domains\Domo\Models\Entities\Percentage;
use App\Domains\Domo\Models\Entities\Precipitation;
use App\Domains\Domo\Models\Entities\Thermometer;
use App\Domains\Domo\Models\Entities\WeatherCondition;
use App\Domains\Domo\Models\Entities\WindSpeed;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WeatherForecast extends Device
{
    public function __construct(
        int $id,
        string $name,
        bool $isActive,
        public readonly ?Thermometer $temperature,
        public readonly ?Hygrometer $humidity,
        public readonly ?Barometer $pressure,
        public readonly ?WindSpeed $windSpeed,
        public readonly ?WindSpeed $windGust,
        public readonly ?Precipitation $dailyPrecipitation,
        public readonly ?Percentage $cloudCover,
        public readonly ?Percentage $freezeChance,
        public readonly ?Percentage $rainChance,
        public readonly ?Percentage $snowChance,
        public readonly ?IntegerValue $uvIndex,
        public readonly ?WeatherCondition $condition,
    ) {
        parent::__construct(
            id: $id,
            name: $name,
            isActive: $isActive,
            type: DeviceType::WeatherForecast,
        );
    }
}
