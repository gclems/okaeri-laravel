<?php

namespace App\Domains\Domo\Models\Devices;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum DeviceType: string
{
    case LightBulb = 'light_bulb';
    case ClimateSensor = 'climate_sensor';
    case Car = 'car';
    case Switch = 'switch';
    case WeatherForecast = 'weather_forecast';
}