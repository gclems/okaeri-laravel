<?php

namespace App\Domains\HomeAssistant\Synchronizers;

use App\Domains\HomeAssistant\DTO\HomeAssistantArea;
use App\Domains\HomeAssistant\Events\HAWSAreasSynchronized;
use App\Domains\HomeAssistant\HAWSClient;

final class HAAreasSynchronizer
{
    public function __construct(
        private HAWSClient $client,
    ) {}

    public function sync(): void
    {
        $areas = $this->client->request([
            'type' => 'config/area_registry/list',
        ]);

        if (! is_array($areas)) {
            throw new \RuntimeException('Home Assistant area registry response is invalid');
        }

        HAWSAreasSynchronized::dispatch(array_map(
            fn (array $area) => HomeAssistantArea::fromArray($area),
            $areas
        ));
    }
}
