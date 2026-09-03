<?php

namespace App\Domains\Domo\Models;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
abstract class Entity
{
    public function __construct(
        public readonly int $id,
    ) {}
}
