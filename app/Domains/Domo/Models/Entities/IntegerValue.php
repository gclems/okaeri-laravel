<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class IntegerValue extends Entity
{
    public function __construct(
        int $id,
        public readonly ?int $value,
    ) {
        parent::__construct(
            $id,
        );
    }
}
