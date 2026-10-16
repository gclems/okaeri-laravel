<?php

namespace App\Domains\Domo\Events;

use App\Models\DomoInput;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DomoInputUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly DomoInput $input
    ) {}

    public function broadcastAs(): string
    {
        return 'DomoInputUpdated';
    }

    public function broadcastOn(): array
    {
        return [
            'domo',
        ];
    }
}
