<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('app:update-sun-phases')
    ->dailyAt('04:00');
