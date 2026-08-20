<?php

namespace App\Domains\HomeAssistant\Events;

use App\Domains\HomeAssistant\DTO\HomeAssistantEntityState;

final class HAWSEntityStateChanged extends HAWSEvent
{
    /**
     * @param  HomeAssistantEntityState[]  $states
     */
    public function __construct(
        array $states,
    ) {
        parent::__construct('state_changed', $states);
    }
}
