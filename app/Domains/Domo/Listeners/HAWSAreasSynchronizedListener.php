<?php

namespace App\Domains\Domo\Listeners;

use App\Domains\Domo\Actions\SyncDomoRooms;
use App\Domains\HomeAssistant\Events\HAWSAreasSynchronized;

class HAWSAreasSynchronizedListener
{
    public function __construct(
        private SyncDomoRooms $action
    ) {}

    /**
     * Handle the event.
     */
    public function handle(HAWSAreasSynchronized $event): void
    {
        $this->action->execute($event->payload);
    }
}
