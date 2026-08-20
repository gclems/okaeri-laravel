<?php

namespace App\Domains\HomeAssistant\Messages;

final readonly class HAAuthOKWSMessage implements HAWSMessage
{
    public function __construct(
        public string $haVersion,
    ) {}

    public function type(): string
    {
        return 'auth_ok';
    }
}