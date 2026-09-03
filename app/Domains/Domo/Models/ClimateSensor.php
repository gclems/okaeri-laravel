<?php

namespace App\Domains\Domo\Models;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ClimateSensor extends Device
{
    public function __construct(
        int $id,
        string $name,
        bool $isActive,
        public readonly ?Battery $battery,
        public readonly ?Thermometer $thermometer,
        public readonly ?Hygrometer $hygrometer,
        public readonly ?Barometer $barometer,
    ) {
        parent::__construct(
            $id,
            $name,
            $isActive,
            $battery,
        );
    }
}
