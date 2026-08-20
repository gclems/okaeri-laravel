<?php

namespace App\Domains\Domo\Listeners;

use App\Domains\Domo\Actions\UpdateDomoEntityStates;
use App\Domains\HomeAssistant\Events\HAWSEntityStateChanged;

class HAWSEntityStateChangedListener
{
    public function __construct(
        private UpdateDomoEntityStates $action
    ) {}

    /**
     * Handle the event.
     */
    public function handle(HAWSEntityStateChanged $event): void
    {
        $this->action->execute($event->payload);
    }
}
