<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class WeatherCondition extends Entity
{
    public function __construct(
        int $id,
        public readonly ?WeatherConditionType $condition,
    ) {
        parent::__construct(
            $id,
        );
    }
}
