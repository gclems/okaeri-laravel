<?php

namespace App\Domains\Domo\Models;

final class Distance extends Entity
{
    public function __construct(
        int $id,
        public readonly ?float $value,
        public readonly ?string $unit,
    ) {
        parent::__construct(
            $id,
        );
    }
}
