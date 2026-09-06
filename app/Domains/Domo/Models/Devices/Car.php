<?php

namespace App\Domains\Domo\Models\Devices;

use App\Domains\Domo\Models\Entities\Battery;
use App\Domains\Domo\Models\Entities\BooleanValue;
use App\Domains\Domo\Models\Entities\Coordinates;
use App\Domains\Domo\Models\Entities\Distance;
use App\Domains\Domo\Models\Entities\IntegerValue;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class Car extends Device
{
    public function __construct(
        int $id,
        string $name,
        bool $isActive,
        ?Battery $battery,
        public readonly ?Distance $mileage,
        public readonly ?Distance $autonomy,
        public readonly BooleanValue $isPlugged,
        public readonly BooleanValue $isCharging,
        public readonly ?Coordinates $coordinates,
        public readonly ?Battery $targetChargeLevel,
        public readonly BooleanValue $energyFlapOpened,
        public readonly IntegerValue $remainingChargingMinutes,
    ) {
        parent::__construct(
            id: $id,
            name: $name,
            isActive: $isActive,
            type: DeviceType::Car,
            battery: $battery,
        );
    }
}
