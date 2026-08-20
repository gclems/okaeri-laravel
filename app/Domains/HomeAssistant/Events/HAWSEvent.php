<?php

namespace App\Domains\HomeAssistant\Events;

use Illuminate\Foundation\Events\Dispatchable;

abstract class HAWSEvent
{
    use Dispatchable;

    public function __construct(
        public readonly string $event,
        public array $payload,
    ) {}
}
