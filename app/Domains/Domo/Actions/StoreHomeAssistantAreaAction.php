<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;

final class StoreHomeAssistantAreaAction
{
    public function __construct(
        private HAWSClient $hawsClient
    ) {}

    public function execute(string $name): void
    {
        $this->hawsClient->requestOnce([
            'type' => 'config/area_registry/create',
            'name' => $name,
        ]);
    }
}
