<?php

namespace App\Domains\Domo\Events;

use App\Models\DomoEntityState;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DomoEntityStateUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly DomoEntityState $state
    ) {}

    public function broadcastAs(): string
    {
        return 'DomoEntityStateUpdated';
    }

    public function broadcastOn(): array
    {
        return [
            'domo',
        ];
    }
}