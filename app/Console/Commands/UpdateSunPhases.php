<?php

namespace App\Console\Commands;

use App\Domains\Domo\Events\SunPhaseUpdated;
use App\Domains\MetNo\MetNoClient;
use App\Models\SunPhase;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:update-sun-phases')]
#[Description('Gets the sun phases for today and tomorrow if they do not exist yet')]
class UpdateSunPhases extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(
        MetNoClient $metNoClient
    ) {
        logger()->info('update sun phases started...');

        $today = now()->startOfDay();
        $tomorrow = now()->addDay()->startOfDay();

        $todaySun = $metNoClient->getSunPhases(
            date: $today,
            latitude: config('metno.latitude'),
            longitude: config('metno.longitude'),
        );

        $tomorrowSun = $metNoClient->getSunPhases(
            date: $tomorrow,
            latitude: config('metno.latitude'),
            longitude: config('metno.longitude'),
        );

        SunPhase::upsert([
            [
                'date' => $today,
                'sunrise_starts_at' => $todaySun->sunriseTime,
                'sunrise_azimuth' => $todaySun->sunriseAzimuth,
                'sunset_starts_at' => $todaySun->sunsetTime,
                'sunset_azimuth' => $todaySun->sunsetAzimuth,
                'solar_noon_at' => $todaySun->solarNoonTime,
                'solar_noon_disc_centre_elevation' => $todaySun->noonDiscCentreElevation,
                'solar_midnight_at' => $todaySun->solarMidnightTime,
                'solar_midnight_disc_centre_elevation' => $todaySun->midnightDiscCentreElevation,
            ],
            [
                'date' => $tomorrow,
                'sunrise_starts_at' => $tomorrowSun->sunriseTime,
                'sunrise_azimuth' => $tomorrowSun->sunriseAzimuth,
                'sunset_starts_at' => $tomorrowSun->sunsetTime,
                'sunset_azimuth' => $tomorrowSun->sunsetAzimuth,
                'solar_noon_at' => $tomorrowSun->solarNoonTime,
                'solar_noon_disc_centre_elevation' => $tomorrowSun->noonDiscCentreElevation,
                'solar_midnight_at' => $tomorrowSun->solarMidnightTime,
                'solar_midnight_disc_centre_elevation' => $tomorrowSun->midnightDiscCentreElevation,
            ],
        ], ['date']);

        SunPhaseUpdated::dispatch();
    }
}