<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Domains\Domo\Models\Entities\DayWeatherForecast;
use App\Models\WeatherDailyForecast;

final class DayWeatherForecastResolver
{
    public function resolve(WeatherDailyForecast $forecast): DayWeatherForecast
    {
        return new DayWeatherForecast(
            id: $forecast->id,
            date: $forecast->date->toDateString(),
            condition: $forecast->condition,
            temperature: $forecast->temperature,
            temperatureLow: $forecast->temperature_low,
            temperatureUnit: $forecast->temperature_unit,
            humidity: $forecast->humidity,
        );
    }
}
