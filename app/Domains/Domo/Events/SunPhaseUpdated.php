<?php

namespace App\Domains\Domo\Events;

use App\Domains\Domo\DomoEventMode;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SunPhaseUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly array $sunPhases,
        public readonly DomoEventMode $mode
    ) {}

    public function broadcastAs(): string
    {
        return 'SunPhaseUpdated';
    }

    public function broadcastOn(): array
    {
        return [
            'domo',
        ];
    }
}
