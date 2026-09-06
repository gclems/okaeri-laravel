<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class Hygrometer extends Entity
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
