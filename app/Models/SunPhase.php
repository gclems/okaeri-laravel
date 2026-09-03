<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property \Carbon\CarbonImmutable $date
 * @property \Carbon\CarbonImmutable $sunrise_starts_at
 * @property float $sunrise_azimuth
 * @property \Carbon\CarbonImmutable $sunset_starts_at
 * @property float $sunset_azimuth
 * @property \Carbon\CarbonImmutable $solar_noon_at
 * @property float $solar_noon_disc_centre_elevation
 * @property \Carbon\CarbonImmutable $solar_midnight_at
 * @property float $solar_midnight_disc_centre_elevation
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereSolarMidnightAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereSolarMidnightDiscCentreElevation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereSolarNoonAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereSolarNoonDiscCentreElevation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereSunriseAzimuth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereSunriseStartsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereSunsetAzimuth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereSunsetStartsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SunPhase whereUpdatedAt($value)
 * @mixin \Eloquent
 */
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
