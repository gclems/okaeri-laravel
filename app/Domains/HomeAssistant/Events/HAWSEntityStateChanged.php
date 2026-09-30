<?php

namespace App\Domains\HomeAssistant\Events;

/**
 * @extends HAWSEvent<mixed>
 */
final class HAWSEntityStateChanged extends HAWSEvent
{
    /**
     * @param  array<mixed>  $states
     */
    public function __construct(
        array $states,
    ) {
        parent::__construct('state_changed', $states);
    }
}
