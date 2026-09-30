<?php

namespace App\Domains\HomeAssistant\Events;

use Illuminate\Foundation\Events\Dispatchable;

/**
 * @template TPayload
 */
abstract class HAWSEvent
{
    use Dispatchable;

    /**
     * @param  array<array-key, TPayload>  $payload
     */
    public function __construct(
        public readonly string $event,
        public array $payload,
    ) {}
}
