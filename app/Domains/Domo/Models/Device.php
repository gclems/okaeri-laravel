<?php

namespace App\Domains\Domo\Models;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
abstract class Device
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly bool $isActive,
        public readonly DeviceType $type,
        public readonly ?int $roomId = null,
        public readonly ?Battery $battery = null,
    ) {}
}
