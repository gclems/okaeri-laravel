<?php

namespace App\Domains\MetNo\DTO;

use DateTimeInterface;

final class MetNoSun
{
    public function __construct(
        public readonly DateTimeInterface $sunriseTime,
        public readonly float $sunriseAzimuth,
        public readonly DateTimeInterface $sunsetTime,
        public readonly float $sunsetAzimuth,
        public readonly DateTimeInterface $solarNoonTime,
        public readonly float $noonDiscCentreElevation,
        public readonly DateTimeInterface $solarMidnightTime,
        public readonly float $midnightDiscCentreElevation,
    ) {}
}
