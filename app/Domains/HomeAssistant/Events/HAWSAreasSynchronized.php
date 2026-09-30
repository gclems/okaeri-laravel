<?php

namespace App\Domains\HomeAssistant\Events;

use App\Domains\HomeAssistant\DTO\HomeAssistantArea;

/**
 * @extends HAWSEvent<HomeAssistantArea>
 */
final class HAWSAreasSynchronized extends HAWSEvent
{
    /**
     * @param  array<array-key, HomeAssistantArea>  $areas
     */
    public function __construct(
        array $areas,
    ) {
        parent::__construct('areas_synchronized', $areas);
    }
}
