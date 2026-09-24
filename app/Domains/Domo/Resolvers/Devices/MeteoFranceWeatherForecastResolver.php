<?php

namespace App\Domains\Domo\Resolvers\Devices;

use App\Domains\Domo\Models\Devices\WeatherForecast;
use App\Domains\Domo\Models\Entities\Thermometer;
use App\Domains\Domo\Resolvers\Entities\DayWeatherForecastResolver;
use App\Domains\Domo\Resolvers\Entities\HourWeatherForecastResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceCloudCoverResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceFreezeChanceResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceHumidityResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFrancePrecipitationResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFrancePressureResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceRainChanceResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceSnowChanceResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceTemperatureResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceUvIndexResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceWeatherAlertResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceWeatherConditionResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceWindGustResolver;
use App\Domains\Domo\Resolvers\Entities\MeteoFranceWindSpeedResolver;
use App\Models\DomoDevice;
use App\Models\WeatherDailyForecast;
use App\Models\WeatherHourlyForecast;

final class MeteoFranceWeatherForecastResolver implements DeviceResolver
{
    public function __construct(
        private readonly MeteoFranceTemperatureResolver $temperatureResolver,
        private readonly MeteoFranceHumidityResolver $humidityResolver,
        private readonly MeteoFrancePressureResolver $pressureResolver,
        private readonly MeteoFranceWindSpeedResolver $windSpeedResolver,
        private readonly MeteoFranceWindGustResolver $windGustResolver,
        private readonly MeteoFrancePrecipitationResolver $precipitationResolver,
        private readonly MeteoFranceCloudCoverResolver $cloudCoverResolver,
        private readonly MeteoFranceFreezeChanceResolver $freezeChanceResolver,
        private readonly MeteoFranceRainChanceResolver $rainChanceResolver,
        private readonly MeteoFranceSnowChanceResolver $snowChanceResolver,
        private readonly MeteoFranceUvIndexResolver $uvIndexResolver,
        private readonly MeteoFranceWeatherConditionResolver $weatherConditionResolver,
        private readonly MeteoFranceWeatherAlertResolver $weatherAlertResolver,
        private readonly DayWeatherForecastResolver $dayWeatherForecastResolver,
        private readonly HourWeatherForecastResolver $hourWeatherForecastResolver,
    ) {}

    public function supports(DomoDevice $device): bool
    {
        return $device->manufacturer === 'Météo-France'
            && $device->model === 'Météo-France mobile API';
    }

    public function resolve(DomoDevice $device): WeatherForecast
    {
        $device->loadMissing(['dailyWeatherForecasts', 'hourlyWeatherForecasts']);

        $temperatureEntity = null;
        $humidityEntity = null;
        $pressureEntity = null;
        $windSpeedEntity = null;
        $windGustEntity = null;
        $precipitationEntity = null;
        $cloudCoverEntity = null;
        $freezeChanceEntity = null;
        $rainChanceEntity = null;
        $snowChanceEntity = null;
        $uvIndexEntity = null;
        $conditionEntity = null;
        $alertEntity = null;

        $device->entities->each(function ($entity) use (
            $device,
            &$temperatureEntity,
            &$humidityEntity,
            &$pressureEntity,
            &$windSpeedEntity,
            &$windGustEntity,
            &$precipitationEntity,
            &$cloudCoverEntity,
            &$freezeChanceEntity,
            &$rainChanceEntity,
            &$snowChanceEntity,
            &$uvIndexEntity,
            &$conditionEntity,
            &$alertEntity,
        ) {
            if (! $temperatureEntity && $this->temperatureResolver->supports($entity, $device)) {
                $temperatureEntity = $this->temperatureResolver->resolve($entity, $device);
            } elseif (! $humidityEntity && $this->humidityResolver->supports($entity, $device)) {
                $humidityEntity = $this->humidityResolver->resolve($entity, $device);
            } elseif (! $pressureEntity && $this->pressureResolver->supports($entity, $device)) {
                $pressureEntity = $this->pressureResolver->resolve($entity, $device);
            } elseif (! $windSpeedEntity && $this->windSpeedResolver->supports($entity, $device)) {
                $windSpeedEntity = $this->windSpeedResolver->resolve($entity, $device);
            } elseif (! $windGustEntity && $this->windGustResolver->supports($entity, $device)) {
                $windGustEntity = $this->windGustResolver->resolve($entity, $device);
            } elseif (! $precipitationEntity && $this->precipitationResolver->supports($entity, $device)) {
                $precipitationEntity = $this->precipitationResolver->resolve($entity, $device);
            } elseif (! $cloudCoverEntity && $this->cloudCoverResolver->supports($entity, $device)) {
                $cloudCoverEntity = $this->cloudCoverResolver->resolve($entity, $device);
            } elseif (! $freezeChanceEntity && $this->freezeChanceResolver->supports($entity, $device)) {
                $freezeChanceEntity = $this->freezeChanceResolver->resolve($entity, $device);
            } elseif (! $rainChanceEntity && $this->rainChanceResolver->supports($entity, $device)) {
                $rainChanceEntity = $this->rainChanceResolver->resolve($entity, $device);
            } elseif (! $snowChanceEntity && $this->snowChanceResolver->supports($entity, $device)) {
                $snowChanceEntity = $this->snowChanceResolver->resolve($entity, $device);
            } elseif (! $uvIndexEntity && $this->uvIndexResolver->supports($entity, $device)) {
                $uvIndexEntity = $this->uvIndexResolver->resolve($entity, $device);
            } elseif (! $conditionEntity && $this->weatherConditionResolver->supports($entity, $device)) {
                $conditionEntity = $this->weatherConditionResolver->resolve($entity, $device);
            } elseif (! $alertEntity && $this->weatherAlertResolver->supports($entity, $device)) {
                $alertEntity = $this->weatherAlertResolver->resolve($entity, $device);
            }
        });

        $todayDailyForecast = $device->dailyWeatherForecasts
            ->first(fn (WeatherDailyForecast $forecast) => $forecast->date->isToday());

        return new WeatherForecast(
            $device->id,
            $device->name,
            $device->is_active,
            $temperatureEntity,
            $humidityEntity,
            $pressureEntity,
            $windSpeedEntity,
            $windGustEntity,
            $precipitationEntity,
            $cloudCoverEntity,
            $freezeChanceEntity,
            $rainChanceEntity,
            $snowChanceEntity,
            $uvIndexEntity,
            $conditionEntity,
            array_values(
                $device->dailyWeatherForecasts
                    ->map(fn (WeatherDailyForecast $forecast) => $this->dayWeatherForecastResolver->resolve($forecast))
                    ->all(),
            ),
            array_values(
                $device->hourlyWeatherForecasts
                    ->map(fn (WeatherHourlyForecast $forecast) => $this->hourWeatherForecastResolver->resolve($forecast))
                    ->all(),
            ),
            $todayDailyForecast
                ? new Thermometer(
                    id: $todayDailyForecast->id,
                    value: $todayDailyForecast->temperature_low,
                    unit: $todayDailyForecast->temperature_unit,
                )
                : null,
            $todayDailyForecast
                ? new Thermometer(
                    id: $todayDailyForecast->id,
                    value: $todayDailyForecast->temperature,
                    unit: $todayDailyForecast->temperature_unit,
                )
                : null,
            $alertEntity,
        );
    }
}
