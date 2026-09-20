<?php

namespace App\Domains\Domo\Listeners;

use App\Domains\Domo\Actions\GenerateWeatherForecastDeviceProjectionAction;
use App\Domains\Domo\Events\WeatherDailyForecastsUpdated;
use App\Domains\Domo\Events\WeatherHourlyForecastsUpdated;

/**
 * Triggers when the daily or hourly weather forecasts are updated.
 * It's purpose is to generate an updated WeatherForecast device projection and trigger a reverb event.
 */
class WeatherForecastsUpdatedListener
{
    public function __construct(
        private GenerateWeatherForecastDeviceProjectionAction $action
    ) {}

    /**
     * Handle the event.
     */
    public function handle(WeatherDailyForecastsUpdated|WeatherHourlyForecastsUpdated $event): void
    {
        $this->action->execute($event->haDeviceId);
    }
}
