<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;
use App\Models\DomoRoom;
use Illuminate\Support\Collection;
use InvalidArgumentException;

final class ToggleRoomsLightsAction
{
    public function __construct(
        private readonly HAWSClient $hawsClient,
    ) {}

    /**
     * Rooms are toggled through the synchronized lights script so that Natural Light
     * is re-enabled for each area. Calls are sequential on purpose: the script runs
     * in "single" mode and HA rejects concurrent runs.
     *
     * @param  Collection<int, DomoRoom>  $rooms
     */
    public function execute(Collection $rooms, string $target_state): void
    {
        if (! in_array($target_state, ['on', 'off'], true)) {
            throw new InvalidArgumentException("Invalid light target state [{$target_state}]");
        }

        foreach ($rooms as $room) {
            $this->hawsClient->callService(
                'script',
                'synchronized_lights_toggle',
                [
                    'area' => $room->ha_id,
                    'state' => $target_state,
                ],
            );
        }
    }
}
