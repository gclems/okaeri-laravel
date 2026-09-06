<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BooleanValue extends Entity
{
    public function __construct(
        int $id,
        public readonly ?bool $value,
    ) {
        parent::__construct(
            $id,
        );
    }
}
