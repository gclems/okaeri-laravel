<?php

namespace App\Domains\Domo\Events;

use App\Domains\Domo\Models\Devices\Device;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeviceUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Device $device
    ) {}

    public function broadcastAs(): string
    {
        return 'DeviceUpdated';
    }

    public function broadcastOn(): array
    {
        return [
            'domo',
        ];
    }
}
