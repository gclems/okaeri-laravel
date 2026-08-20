<?php

namespace App\Domains\Domo\Listeners;

use App\Domains\Domo\Actions\SyncDomoDevices;
use App\Domains\HomeAssistant\Events\HAWSDevicesSynchronized;

class HAWSDevicesSynchronizedListener
{
    public function __construct(
        private SyncDomoDevices $action
    ) {}

    /**
     * Handle the event.
     */
    public function handle(HAWSDevicesSynchronized $event): void
    {
        $this->action->execute($event->payload);
    }
}
