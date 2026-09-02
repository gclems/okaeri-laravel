<?php

namespace App\Console\Commands;

use App\Domains\Domo\DomoEventMode;
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

        /* Determine the range of dates with missing data */
        $dates = [];
        for ($i = 0; $i < config('domo.sun-phase.keep_before'); $i++) {
            $dates[] = now()->subDays($i + 1)->startOfDay();
        }
        $dates[] = $today;
        for ($i = 0; $i < config('domo.sun-phase.keep_after'); $i++) {
            $dates[] = now()->addDays($i + 1)->startOfDay();
        }

        $existingPhaseDates = SunPhase::whereIn('date', $dates)->pluck('date')->toArray();

        $datesToFetch = array_filter($dates, fn ($date) => ! in_array($date, $existingPhaseDates));
        $count = count($datesToFetch);
        $this->info("Missing {$count} sun phase(s).");

        if ($count > 0) {
            $progress = $this->output->createProgressBar($count);
            $progress->start();

            /* Fetch and insert missing data from MetNo to db */
            $toCreate = [];
            foreach ($datesToFetch as $date) {
                $sun = $metNoClient->getSunPhases(
                    date: $date,
                    latitude: config('metno.latitude'),
                    longitude: config('metno.longitude'),
                );

                $toCreate[] = [
                    'date' => $date,
                    'sunrise_starts_at' => $sun->sunriseTime,
                    'sunrise_azimuth' => $sun->sunriseAzimuth,
                    'sunset_starts_at' => $sun->sunsetTime,
                    'sunset_azimuth' => $sun->sunsetAzimuth,
                    'solar_noon_at' => $sun->solarNoonTime,
                    'solar_noon_disc_centre_elevation' => $sun->noonDiscCentreElevation,
                    'solar_midnight_at' => $sun->solarMidnightTime,
                    'solar_midnight_disc_centre_elevation' => $sun->midnightDiscCentreElevation,
                ];

                $progress->advance();
            }

            $progress->finish();

            if (count($toCreate) > 0) {
                SunPhase::insert($toCreate);
            }

            /* Delete data outside of keeping range, ie the $dates array */
            SunPhase::whereNotIn('date', $dates)->delete();

            SunPhaseUpdated::dispatch(SunPhase::all()->toArray(), DomoEventMode::REPLACE);
        } else {
            $this->info('No missing sun phase data.');
        }
    }
}
