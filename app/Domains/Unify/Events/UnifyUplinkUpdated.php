<?php

namespace App\Domains\Unify\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UnifyUplinkUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $txRateBps,
        public readonly int $rxRateBps,
    ) {}

    public function broadcastAs(): string
    {
        return 'UnifyUplinkUpdated';
    }

    public function broadcastOn(): array
    {
        return [
            'unify',
        ];
    }
}
