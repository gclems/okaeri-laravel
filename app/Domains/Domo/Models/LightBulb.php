<?php

namespace App\Domains\Domo\Models;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class LightBulb extends Device
{
    public function __construct(
        int $id,
        string $name,
        bool $isActive,
        public readonly LightState $light,
        ?int $roomId = null,
        ?Battery $battery = null,
    ) {
        parent::__construct(
            id: $id,
            name: $name,
            isActive: $isActive,
            type: DeviceType::LightBulb,
            roomId: $roomId,
            battery: $battery,
        );
    }
}
