<?php

namespace App\Domains\Domo\Models;

final class LightState extends Entity
{
    public function __construct(
        int $id,
        public readonly bool $isOn,
        public readonly bool $supportsColor,
        public readonly ?int $brightness,
        public readonly ?string $rgb,
    ) {
        parent::__construct($id);
    }
}
