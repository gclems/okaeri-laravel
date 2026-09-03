<?php

namespace App\Domains\Domo\Models;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class Renault4 extends Device
{
    public function __construct(
        int $id,
        string $name,
        bool $isActive,
        public readonly ?Battery $battery,
        public readonly ?Distance $totalDistance,
        public readonly ?Distance $autonomy,
        // charging state
        // charging level target
        // remainingChargingTime
        // plug state
        // position -> gps
    ) {
        parent::__construct(
            $id,
            $name,
            $isActive,
            $battery,
        );
    }
}
