<?php

namespace App\Domains\Domo\Models\Entities;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
abstract class Entity
{
    public function __construct(
        public readonly int $id,
    ) {}
}
