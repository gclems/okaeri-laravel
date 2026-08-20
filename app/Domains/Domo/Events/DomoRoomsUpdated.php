<?php

namespace App\Domains\Domo\Events;

use App\Domains\Domo\DomoEventMode;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DomoRoomsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly array $rooms,
        public readonly DomoEventMode $mode
    ) {}

    public function broadcastAs(): string
    {
        return 'DomoRoomsUpdated';
    }

    public function broadcastOn(): array
    {
        return [
            'domo',
        ];
    }
}
