<?php

namespace App\Domains\Domo\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class HomeAssistantEntitiesUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Collection $entities
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('home_assistant'),
        ];
    }
}
