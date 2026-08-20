<?php

namespace App\Domains\HomeAssistant\Messages;

final readonly class HAUnknownWSMessage implements HAWSMessage
{
    public function __construct(
        private string $type,
        public string $haVersion,
        private array $payload = [],
    ) {}

    public function type(): string
    {
        return $this->type;
    }

    public function payload(): array
    {
        return $this->payload;
    }
}
