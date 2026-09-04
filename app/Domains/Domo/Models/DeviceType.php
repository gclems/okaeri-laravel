<?php

namespace App\Domains\Domo\Models;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum DeviceType: string
{
    case LightBulb = 'light_bulb';
    case ClimateSensor = 'climate_sensor';
    case Renault4 = 'renault4';
}
