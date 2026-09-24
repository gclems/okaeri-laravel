<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum WeatherAlertLevel: string
{
    case Green = 'Vert';
    case Yellow = 'Jaune';
    case Orange = 'Orange';
    case Red = 'Rouge';
}
