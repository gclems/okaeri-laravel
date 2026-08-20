<?php

namespace App\Domains\HomeAssistant\Messages;

interface HAWSMessage
{
    public function type(): string;
}
