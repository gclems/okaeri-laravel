<?php

namespace App\Domains\HomeAssistant\Events;

use App\Domains\HomeAssistant\DTO\HomeAssistantArea;

final class HAWSAreasSynchronized extends HAWSEvent
{
    /**
     * @param  HomeAssistantArea[]  $areas
     */
    public function __construct(
        array $areas,
    ) {
        parent::__construct('areas_synchronized', $areas);
    }
}
