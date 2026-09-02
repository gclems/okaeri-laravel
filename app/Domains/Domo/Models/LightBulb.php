<?php

namespace App\Domains\Domo\Models;

final class LightBulb extends Device
{
    public function __construct(
        int $id,
        string $name,
        bool $isActive,
        public readonly LightState $light,
        ?Battery $battery = null,
    ) {
        parent::__construct($id, $name, $isActive, $battery);
    }
}
