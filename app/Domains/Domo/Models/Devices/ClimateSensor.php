<?php

namespace App\Domains\Domo\Models\Devices;

use App\Domains\Domo\Models\Entities\Barometer;
use App\Domains\Domo\Models\Entities\Battery;
use App\Domains\Domo\Models\Entities\Hygrometer;
use App\Domains\Domo\Models\Entities\Thermometer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ClimateSensor extends Device
{
    public function __construct(
        int $id,
        string $name,
        bool $isActive,
        ?int $roomId,
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
