<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum WeatherConditionType: string
{
    case Sunny = 'sunny';
    case ClearNight = 'clear-night';
    case PartlyCloudy = 'partlycloudy';
    case Cloudy = 'cloudy';
    case Fog = 'fog';
    case Windy = 'windy';
    case WindyVariant = 'windy-variant';
    case Rainy = 'rainy';
    case Pouring = 'pouring';
    case Lightning = 'lightning';
    case LightningRainy = 'lightning-rainy';
    case Hail = 'hail';
    case Snowy = 'snowy';
    case SnowyRainy = 'snowy-rainy';
    case Exceptional = 'exceptional';
}
