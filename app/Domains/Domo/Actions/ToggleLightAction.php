<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;

final class ToggleLightAction
{
    public function __construct(
        private readonly HAWSClient $hawsClient,
    ) {}

    public function execute(string $entity_ha_id): void
    {
        $this->hawsClient->callService(
            'light',
            'toggle',
            null,
            [
                'entity_id' => $entity_ha_id,
            ]
        );
    }
}
