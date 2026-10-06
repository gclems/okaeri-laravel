<?php

namespace App\Domains\Domo\Tracers;

use App\Models\DomoEntity;

final class GeneralEntityTracer
{
    /**
     * Ordered by priority: the first supporting tracer wins. Device-scoped tracers
     * (slug based) come before the MeteoFrance ones, whose suffix matching
     * (e.g. "_temperature") would otherwise catch other devices' entities.
     *
     * @var list<EntityTracer>
     */
    private readonly array $tracers;

    public function __construct(
        AqaraBarometerTracer $aqaraBarometerTracer,
        AqaraHygrometerTracer $aqaraHygrometerTracer,
        AqaraThermometerTracer $aqaraThermometerTracer,
        BatteryTracer $batteryTracer,
        Renault4AutonomyTracer $renault4AutonomyTracer,
        Renault4ChargingTracer $renault4ChargingTracer,
        Renault4CoordinatesTracer $renault4CoordinatesTracer,
        Renault4FlapOpenedTracer $renault4FlapOpenedTracer,
        Renault4MileageTracer $renault4MileageTracer,
        Renault4PluggedTracer $renault4PluggedTracer,
        Renault4RemainingChargingMinutesTracer $renault4RemainingChargingMinutesTracer,
        Renault4TargetChargeTracer $renault4TargetChargeTracer,
        HueLightStateTracer $hueLightStateTracer,
        ZLinkyEnergyIndexTracer $zLinkyEnergyIndexTracer,
        MeteoFranceCloudCoverTracer $meteoFranceCloudCoverTracer,
        MeteoFranceFreezeChanceTracer $meteoFranceFreezeChanceTracer,
        MeteoFranceHumidityTracer $meteoFranceHumidityTracer,
        MeteoFrancePrecipitationTracer $meteoFrancePrecipitationTracer,
        MeteoFrancePressureTracer $meteoFrancePressureTracer,
        MeteoFranceRainChanceTracer $meteoFranceRainChanceTracer,
        MeteoFranceSnowChanceTracer $meteoFranceSnowChanceTracer,
        MeteoFranceTemperatureTracer $meteoFranceTemperatureTracer,
        MeteoFranceUvIndexTracer $meteoFranceUvIndexTracer,
        MeteoFranceWeatherAlertTracer $meteoFranceWeatherAlertTracer,
        MeteoFranceWeatherConditionTracer $meteoFranceWeatherConditionTracer,
        MeteoFranceWindGustTracer $meteoFranceWindGustTracer,
        MeteoFranceWindSpeedTracer $meteoFranceWindSpeedTracer,
    ) {
        $this->tracers = [
            $aqaraBarometerTracer,
            $aqaraHygrometerTracer,
            $aqaraThermometerTracer,
            $batteryTracer,
            $renault4AutonomyTracer,
            $renault4ChargingTracer,
            $renault4CoordinatesTracer,
            $renault4FlapOpenedTracer,
            $renault4MileageTracer,
            $renault4PluggedTracer,
            $renault4RemainingChargingMinutesTracer,
            $renault4TargetChargeTracer,
            $hueLightStateTracer,
            $zLinkyEnergyIndexTracer,
            $meteoFranceCloudCoverTracer,
            $meteoFranceFreezeChanceTracer,
            $meteoFranceHumidityTracer,
            $meteoFrancePrecipitationTracer,
            $meteoFrancePressureTracer,
            $meteoFranceRainChanceTracer,
            $meteoFranceSnowChanceTracer,
            $meteoFranceTemperatureTracer,
            $meteoFranceUvIndexTracer,
            $meteoFranceWeatherAlertTracer,
            $meteoFranceWeatherConditionTracer,
            $meteoFranceWindGustTracer,
            $meteoFranceWindSpeedTracer,
        ];
    }

    /**
     * Entities not recognized by any tracer are not traced.
     */
    public function findTracer(DomoEntity $entity): ?EntityTracer
    {
        $device = $entity->device;

        if ($device === null) {
            return null;
        }

        return collect($this->tracers)
            ->first(fn (EntityTracer $tracer) => $tracer->supports($entity, $device));
    }
}
