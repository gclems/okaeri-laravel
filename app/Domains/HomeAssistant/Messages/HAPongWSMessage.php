<?php

namespace App\Domains\HomeAssistant\Messages;

final readonly class HAPongWSMessage implements HAWSMessage
{
    public function type(): string
    {
        return 'pong';
    }
}
