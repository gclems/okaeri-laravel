<?php

namespace App\Domains\Domo\Resolvers\Devices;

use App\Domains\Domo\Models\Devices\Car;
use App\Domains\Domo\Resolvers\Entities\BatteryResolver;
use App\Domains\Domo\Resolvers\Entities\Renault4AutonomyResolver;
use App\Domains\Domo\Resolvers\Entities\Renault4ChargingResolver;
use App\Domains\Domo\Resolvers\Entities\Renault4CoordinatesResolver;
use App\Domains\Domo\Resolvers\Entities\Renault4FlapOpenedResolver;
use App\Domains\Domo\Resolvers\Entities\Renault4MileageResolver;
use App\Domains\Domo\Resolvers\Entities\Renault4PluggedResolver;
use App\Domains\Domo\Resolvers\Entities\Renault4RemainingChargingMinutesResolver;
use App\Domains\Domo\Resolvers\Entities\Renault4TargetChargeResolver;
use App\Models\DomoDevice;

final class Renault4Resolver implements DeviceResolver
{
    public function __construct(
        private readonly BatteryResolver $batteryResolver,
        private readonly Renault4MileageResolver $mileageResolver,
        private readonly Renault4AutonomyResolver $autonomyResolver,
        private readonly Renault4PluggedResolver $pluggedResolver,
        private readonly Renault4ChargingResolver $chargingResolver,
        private readonly Renault4CoordinatesResolver $coordinatesResolver,
        private readonly Renault4TargetChargeResolver $targetChargeResolver,
        private readonly Renault4FlapOpenedResolver $flapOpenedResolver,
        private readonly Renault4RemainingChargingMinutesResolver $remainingChargingMinutesResolver
    ) {}

    public function supports(DomoDevice $device): bool
    {
        return $device->manufacturer === 'Renault' &&
            $device->model === 'R4 e-tech';
    }

    public function resolve(DomoDevice $device): Car
    {
        $batteryEntity = null;
        $mileageEntity = null;
        $autonomyEntity = null;
        $isPluggedEntity = null;
        $isChargingEntity = null;
        $coordinatesEntity = null;
        $targetChargeEntity = null;
        $flapOpenedEntity = null;
        $remainingChargingMinutesEntity = null;

        // A single HA entity (e.g. "etat_de_charge") can carry several distinct
        // pieces of information depending on its value, so every entity must be
        // checked against every resolver instead of stopping at the first match.
        $device->entities->each(function ($entity) use (
            $device,
            &$batteryEntity,
            &$mileageEntity,
            &$autonomyEntity,
            &$isPluggedEntity,
            &$isChargingEntity,
            &$coordinatesEntity,
            &$targetChargeEntity,
            &$flapOpenedEntity,
            &$remainingChargingMinutesEntity,
        ) {
            if (! $batteryEntity && $this->batteryResolver->supports($entity, $device)) {
                $batteryEntity = $this->batteryResolver->resolve($entity, $device);
            }

            if (! $mileageEntity && $this->mileageResolver->supports($entity, $device)) {
                $mileageEntity = $this->mileageResolver->resolve($entity, $device);
            }

            if (! $autonomyEntity && $this->autonomyResolver->supports($entity, $device)) {
                $autonomyEntity = $this->autonomyResolver->resolve($entity, $device);
            }

            if (! $isPluggedEntity && $this->pluggedResolver->supports($entity, $device)) {
                $isPluggedEntity = $this->pluggedResolver->resolve($entity, $device);
            }

            if (! $isChargingEntity && $this->chargingResolver->supports($entity, $device)) {
                $isChargingEntity = $this->chargingResolver->resolve($entity, $device);
            }

            if (! $coordinatesEntity && $this->coordinatesResolver->supports($entity, $device)) {
                $coordinatesEntity = $this->coordinatesResolver->resolve($entity, $device);
            }

            if (! $targetChargeEntity && $this->targetChargeResolver->supports($entity, $device)) {
                $targetChargeEntity = $this->targetChargeResolver->resolve($entity, $device);
            }

            if (! $flapOpenedEntity && $this->flapOpenedResolver->supports($entity, $device)) {
                $flapOpenedEntity = $this->flapOpenedResolver->resolve($entity, $device);
            }

            if (! $remainingChargingMinutesEntity && $this->remainingChargingMinutesResolver->supports($entity, $device)) {
                $remainingChargingMinutesEntity = $this->remainingChargingMinutesResolver->resolve($entity, $device);
            }
        });

        return new Car(
            $device->id,
            $device->name,
            $device->is_active,
            $batteryEntity,
            $mileageEntity,
            $autonomyEntity,
            $isPluggedEntity ?? throw new \RuntimeException("No plugged-state entity found for Renault 4 device [{$device->id}]"),
            $isChargingEntity ?? throw new \RuntimeException("No charging-state entity found for Renault 4 device [{$device->id}]"),
            $coordinatesEntity,
            $targetChargeEntity,
            $flapOpenedEntity ?? throw new \RuntimeException("No energy flap entity found for Renault 4 device [{$device->id}]"),
            $remainingChargingMinutesEntity ?? throw new \RuntimeException("No remaining charging minutes entity found for Renault 4 device [{$device->id}]"),
        );
    }
}
