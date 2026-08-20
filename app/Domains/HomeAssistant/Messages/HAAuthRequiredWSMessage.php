<?php

namespace App\Domains\HomeAssistant\Messages;

final readonly class HAAuthRequiredWSMessage implements HAWSMessage
{
    public function __construct(
        public string $haVersion,
    ) {}

    public function type(): string
    {
        return 'auth_required';
    }
}
