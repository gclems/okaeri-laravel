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
        ?string $roomId,
        ?Battery $battery,
        public readonly ?Thermometer $thermometer,
        public readonly ?Hygrometer $hygrometer,
        public readonly ?Barometer $barometer,
    ) {
        parent::__construct(
            id: $id,
            name: $name,
            isActive: $isActive,
            type: DeviceType::ClimateSensor,
            roomId: $roomId,
            battery: $battery,
        );
    }
}