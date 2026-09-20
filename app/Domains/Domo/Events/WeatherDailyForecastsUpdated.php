<?php

namespace App\Domains\Domo\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WeatherDailyForecastsUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly string $haDeviceId,
    ) {}

    public function broadcastAs(): string
    {
        return 'WeatherDailyForecastsUpdated';
    }

    public function broadcastOn(): array
    {
        return [
            'domo',
        ];
    }
}
