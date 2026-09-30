<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;
use InvalidArgumentException;

final class ToggleLightsAction
{
    public function __construct(
        private readonly HAWSClient $hawsClient,
    ) {}

    /**
     * @param  array<int, string>  $entities_ha_ids
     */
    public function execute(array $entities_ha_ids, string $target_state): void
    {
        $service = match ($target_state) {
            'on' => 'turn_on',
            'off' => 'turn_off',
            default => throw new InvalidArgumentException("Invalid light target state [{$target_state}]"),
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
