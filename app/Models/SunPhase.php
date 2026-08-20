<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SunPhase extends Model
{
    public function casts(): array
    {
        return [
            'date' => 'date',

            'sunrise_starts_at' => 'datetime',
            'sunrise_azimuth' => 'float',

            'sunset_starts_at' => 'datetime',
            'sunset_azimuth' => 'float',

            'solar_noon_at' => 'datetime',
            'solar_noon_disc_centre_elevation' => 'float',

            'solar_midnight_at' => 'datetime',
            'solar_midnight_disc_centre_elevation' => 'float',
        ];
    }
}
