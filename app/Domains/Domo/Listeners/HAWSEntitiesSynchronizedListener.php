<?php

namespace App\Domains\Domo\Listeners;

use App\Domains\Domo\Actions\SyncDomoEntities;
use App\Domains\HomeAssistant\Events\HAWSEntitiesSynchronized;

class HAWSEntitiesSynchronizedListener
{
    public function __construct(
        private SyncDomoEntities $action
    ) {}

    /**
     * Handle the event.
     */
    public function handle(HAWSEntitiesSynchronized $event): void
    {
        $this->action->execute($event->payload);
    }
}
