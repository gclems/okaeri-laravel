<?php

namespace App\Domains\Domo\Models\Devices;

use App\Domains\Domo\Models\Entities\Battery;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class SwitchDevice extends Device
{
    public function __construct(
        int $id,
        string $name,
        bool $isActive,
        ?Battery $battery,
        ?int $roomId = null,
    ) {
        parent::__construct(
            id: $id,
            name: $name,
            isActive: $isActive,
            type: DeviceType::Switch,
            roomId: $roomId,
            battery: $battery,
        );
    }
}
