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
     * Native light services are fine for individual bulbs: each bulb adapts on its own
     * to the Natural Light behaviour induced by its room's activation state.
     * Whole rooms must go through ToggleRoomsLightsAction instead.
     *
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
