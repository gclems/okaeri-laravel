<?php

namespace App\Domains\Domo\Listeners;

use App\Domains\Domo\Actions\SyncDomoRooms;
use App\Domains\Domo\Events\DomoEntityStateUpdated;

/**
 * Triggers when the DomoEntityStateUpdate event is raised.
 * It's purpose is to generate an updated Device projection et trigger a reverb event.
 */
class DomoEntityStateUpdatedListener
{
    public function __construct(
        private SyncDomoRooms $action
    ) {}

    /**
     * Handle the DomoEntityStateUpdated event.
     */
    public function handle(DomoEntityStateUpdated $event): void
    {
        $this->action->execute($event->payload);
    }
}