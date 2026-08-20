<?php

namespace App\Domains\MetNo;

use App\Domains\MetNo\DTO\MetNoSun;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Support\Facades\Http;

final class MetNoClient
{
    public function getSunPhases(
        DateTimeInterface $date,
        float $latitude,
        float $longitude,
    ): MetNoSun {
        $url = 'https://api.met.no/weatherapi/sunrise/3.0/sun';

        $response = Http::withHeaders([
            'User-Agent' => config('metno.user_agent'),
        ])->get($url, [
            'lat' => $latitude,
            'lon' => $longitude,
            'date' => $date->format('Y-m-d'),
        ])->throw()->json();

        logger()->debug('MetNo Client', ['response' => $response]);

        return new MetNoSun(
            Carbon::parse($response['properties']['sunrise']['time']),
            $response['properties']['sunrise']['azimuth'],
            Carbon::parse($response['properties']['sunset']['time']),
            $response['properties']['sunset']['azimuth'],
            Carbon::parse($response['properties']['solarnoon']['time']),
            $response['properties']['solarnoon']['disc_centre_elevation'],
            Carbon::parse($response['properties']['solarmidnight']['time']),
            $response['properties']['solarmidnight']['disc_centre_elevation']
        );
    }
}
