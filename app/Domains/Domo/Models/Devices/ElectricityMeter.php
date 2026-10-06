<?php

namespace App\Domains\Domo\Models\Devices;

use App\Domains\Domo\Models\Entities\ElectricMeasurement;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class ElectricityMeter extends Device
{
    /**
     * @param  list<ElectricMeasurement>  $consumptionTiers
     */
    public function __construct(
        int $id,
        string $name,
        bool $isActive,
        ?int $roomId,
        public readonly ?ElectricMeasurement $consumption,
        public readonly array $consumptionTiers,
        public readonly ?ElectricMeasurement $injectedEnergy,
        public readonly ?ElectricMeasurement $activePower,
        public readonly ?ElectricMeasurement $activePowerPhaseB,
        public readonly ?ElectricMeasurement $totalActivePower,
        public readonly ?ElectricMeasurement $apparentPower,
        public readonly ?ElectricMeasurement $current,
        public readonly ?ElectricMeasurement $currentPhaseB,
        public readonly ?ElectricMeasurement $currentPhaseC,
        public readonly ?ElectricMeasurement $voltage,
        public readonly ?ElectricMeasurement $voltagePhaseB,
        public readonly ?ElectricMeasurement $voltagePhaseC,
    ) {
        parent::__construct(
            id: $id,
            name: $name,
            isActive: $isActive,
            type: DeviceType::ElectricityMeter,
            roomId: $roomId,
        );
    }
}
