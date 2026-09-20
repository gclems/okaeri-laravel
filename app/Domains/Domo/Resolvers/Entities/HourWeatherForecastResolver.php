<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\HourWeatherForecast;
use App\Models\WeatherHourlyForecast;

final class HourWeatherForecastResolver
{
    public function resolve(WeatherHourlyForecast $forecast): HourWeatherForecast
    {
        return new HourWeatherForecast(
            id: $forecast->id,
            date: $forecast->date->toISOString(),
            condition: $forecast->condition,
            temperature: $forecast->temperature,
            temperatureUnit: $forecast->temperature_unit,
            humidity: $forecast->humidity,
        );
    }
}
