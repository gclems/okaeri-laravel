<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;

final class ToggleLightsAction
{
    public function __construct(
        private readonly HAWSClient $hawsClient,
    ) {}

    public function execute(array $entities_ha_ids, string $target_state): void
    {
        $service = match ($target_state) {
            'on' => 'turn_on',
            'off' => 'turn_off',
        };

        $this->hawsClient->callService(
            'light',
            $service,
            null,
            [
                'entity_id' => $entities_ha_ids,
            ]
        );
    }
}