<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class Coordinates extends Entity
{
    public function __construct(
        int $id,
        public readonly ?float $latitude,
        public readonly ?float $longitude,
    ) {
        parent::__construct(
            $id,
        );
    }
}
