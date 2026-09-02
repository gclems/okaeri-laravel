<?php

namespace App\Domains\Domo\Models;

final class Battery extends Entity
{
    public function __construct(
        int $id,
        public readonly ?float $level,
        public readonly ?string $levelUnit,
    ) {
        parent::__construct(
            $id,
        );
    }
}
