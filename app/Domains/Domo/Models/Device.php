<?php

namespace App\Domains\Domo\Models;

abstract class Device
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly bool $isActive,
        public readonly ?Battery $battery = null,
    ) {}
}
