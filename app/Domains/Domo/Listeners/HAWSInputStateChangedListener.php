<?php

namespace App\Domains\Domo\Listeners;

use App\Domains\Domo\Actions\UpdateDomoInputs;
use App\Domains\HomeAssistant\Events\HAWSEntityStateChanged;

class HAWSInputStateChangedListener
{
    public function __construct(
        private UpdateDomoInputs $action
    ) {}

    /**
     * Handle the event.
     */
    public function handle(HAWSEntityStateChanged $event): void
    {
        $this->action->execute($event->payload);
    }
}
