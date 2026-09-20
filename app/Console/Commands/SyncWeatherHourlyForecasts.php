<?php

namespace App\Console\Commands;

use App\Domains\Domo\Actions\StoreWeatherHourlyForecastsAction;
use App\Domains\HomeAssistant\DTO\HomeAssistantWeatherForecast;
use App\Domains\HomeAssistant\HAWSClient;
use App\Models\DomoEntity;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:sync-weather-hourly-forecasts')]
#[Description('Fetches the hourly weather forecast for every weather entity from Home Assistant')]
class SyncWeatherHourlyForecasts extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(
        HAWSClient $hawsClient,
        StoreWeatherHourlyForecastsAction $storeWeatherHourlyForecasts,
    ) {
        $weatherEntities = DomoEntity::with('state')
            ->where('ha_id', 'like', 'weather.%')
            ->get();

        foreach ($weatherEntities as $entity) {
            if (! $entity->ha_device_id || ! $entity->state) {
                continue;
            }

            $response = $hawsClient->callService(
                domain: 'weather',
                service: 'get_forecasts',
                serviceData: ['type' => 'hourly'],
                target: ['entity_id' => $entity->ha_id],
                returnResponse: true,
            );

            $forecasts = array_map(
                fn (array $forecast) => HomeAssistantWeatherForecast::fromArray($forecast),
                $response['response'][$entity->ha_id]['forecast'] ?? [],
            );

            $storeWeatherHourlyForecasts->execute(
                haDeviceId: $entity->ha_device_id,
                temperatureUnit: $entity->state->attributes['temperature_unit'],
                forecasts: $forecasts,
            );
        }
    }
}
