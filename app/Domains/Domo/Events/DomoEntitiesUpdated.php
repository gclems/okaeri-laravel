<?php

namespace App\Domains\Domo\Events;

use App\Domains\Domo\DomoEventMode;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DomoEntitiesUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly array $entities,
        public readonly DomoEventMode $mode
    ) {}

    public function broadcastAs(): string
    {
        return 'DomoEntitiesUpdated';
    }

    public function broadcastOn(): array
    {
        return [
            'domo',
        ];
    }
}
