<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Events\WeatherHourlyForecastsUpdated;
use App\Domains\HomeAssistant\DTO\HomeAssistantWeatherForecast;
use App\Models\WeatherHourlyForecast;
use Illuminate\Support\Carbon;

final class StoreWeatherHourlyForecastsAction
{
    /**
     * @param  HomeAssistantWeatherForecast[]  $forecasts
     */
    public function execute(string $haDeviceId, string $temperatureUnit, array $forecasts): void
    {
        $rows = collect($forecasts)
            ->map(fn (HomeAssistantWeatherForecast $forecast) => [
                'ha_device_id' => $haDeviceId,
                'date' => Carbon::parse($forecast->datetime)->toDateTimeString(),
                'condition' => $forecast->condition,
                'temperature' => $forecast->temperature,
                'temperature_unit' => $temperatureUnit,
                'humidity' => $forecast->humidity,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        WeatherHourlyForecast::upsert(
            $rows->toArray(),
            ['ha_device_id', 'date'],
            ['condition', 'temperature', 'temperature_unit', 'humidity', 'updated_at'],
        );

        WeatherHourlyForecast::where('ha_device_id', $haDeviceId)
            ->where('date', '<', now()->startOfDay())
            ->delete();

        WeatherHourlyForecastsUpdated::dispatch($haDeviceId);
    }
}
