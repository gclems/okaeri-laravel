<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Events\WeatherDailyForecastsUpdated;
use App\Domains\HomeAssistant\DTO\HomeAssistantWeatherForecast;
use App\Models\WeatherDailyForecast;
use Illuminate\Support\Carbon;

final class StoreWeatherDailyForecastsAction
{
    /**
     * @param  HomeAssistantWeatherForecast[]  $forecasts
     */
    public function execute(string $haDeviceId, string $temperatureUnit, array $forecasts): void
    {
        $rows = collect($forecasts)
            ->map(fn (HomeAssistantWeatherForecast $forecast) => [
                'ha_device_id' => $haDeviceId,
                'date' => Carbon::parse($forecast->datetime)->toDateString(),
                'condition' => $forecast->condition,
                'temperature' => $forecast->temperature,
                'temperature_low' => $forecast->temperatureLow,
                'temperature_unit' => $temperatureUnit,
                'humidity' => $forecast->humidity,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        WeatherDailyForecast::upsert(
            $rows->toArray(),
            ['ha_device_id', 'date'],
            ['condition', 'temperature', 'temperature_low', 'temperature_unit', 'humidity', 'updated_at'],
        );

        WeatherDailyForecast::where('ha_device_id', $haDeviceId)
            ->whereNotIn('date', $rows->pluck('date'))
            ->delete();

        WeatherDailyForecastsUpdated::dispatch($haDeviceId);
    }
}
