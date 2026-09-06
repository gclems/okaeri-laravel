<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class Percentage extends Entity
{
    public readonly string $unit;

    public function __construct(
        int $id,
        public readonly ?float $value,
    ) {
        parent::__construct(
            $id,
        );

        $this->unit = '%';
    }
}
