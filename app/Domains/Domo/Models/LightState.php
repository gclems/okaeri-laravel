<?php

namespace App\Domains\Domo\Models;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
final class LightState extends Entity
{
    public function __construct(
        int $id,
        public readonly bool $isOn,
        public readonly bool $supportsColor,
        public readonly ?float $brightness,
        public readonly ?string $rgb,
    ) {
        parent::__construct($id);
    }
}
