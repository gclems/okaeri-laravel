<?php

namespace App\Domains\Domo\Models;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
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
