<?php

namespace App\Domains\Domo\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DomoRoomsUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct() {}

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
