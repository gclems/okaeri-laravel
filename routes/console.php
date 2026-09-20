<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:update-sun-phases')
    ->dailyAt('04:00');

Schedule::command('app:sync-weather-hourly-forecasts')
    ->hourly();

Schedule::command('app:sync-weather-daily-forecasts')
    ->everySixHours();
