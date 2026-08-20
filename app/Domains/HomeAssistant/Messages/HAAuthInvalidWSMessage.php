<?php

namespace App\Domains\HomeAssistant\Messages;

final readonly class HAAuthInvalidWSMessage implements HAWSMessage
{
    public function __construct(
        public string $message,
    ) {}

    public function type(): string
    {
        return 'auth_invalid';
    }
}
