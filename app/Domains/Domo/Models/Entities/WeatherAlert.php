<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WeatherAlert extends Entity
{
    /**
     * @param  array<string, WeatherAlertLevel>  $risks
     */
    public function __construct(
        int $id,
        public readonly ?WeatherAlertLevel $level,
        public readonly array $risks,
    ) {
        parent::__construct(
            $id,
        );
    }
}
