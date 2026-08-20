<?php

namespace App\Domains\HomeAssistant\Messages;

final readonly class HAEventWSMessage implements HAWSMessage
{
    public function __construct(
        public int $id,
        public string $eventType,
        public array $data,
    ) {}

    public function type(): string
    {
        return 'event';
    }
}
