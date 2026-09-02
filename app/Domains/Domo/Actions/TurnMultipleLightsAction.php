<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;

final class TurnMultipleLightsAction
{
    public function __construct(
        private readonly HAWSClient $hawsClient,
    ) {}

    public function execute(array $entities_ha_ids): void
    {
        $this->hawsClient->callService(
            'light',
            'turn_off',
            null,
            [
                'entity_id' => $entities_ha_ids,
            ]
        );
    }
}
