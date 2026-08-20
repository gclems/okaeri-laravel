<?php

namespace App\Domains\HomeAssistant\Messages;

final readonly class HAResultWSMessage implements HAWSMessage
{
    public function __construct(
        public int $id,
        public bool $success,
        public mixed $result = null,
        public ?array $error = null,
    ) {}

    public function type(): string
    {
        return 'result';
    }
}
