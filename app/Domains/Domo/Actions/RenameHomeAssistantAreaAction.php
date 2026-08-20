<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;
use App\Models\DomoRoom;

final class RenameHomeAssistantAreaAction
{
    public function __construct(
        private HAWSClient $hawsClient
    ) {}

    public function execute(DomoRoom $room, string $name): void
    {
        $this->hawsClient->requestOnce([
            'type' => 'config/area_registry/update',
            'area_id' => $room->ha_id,
            'name' => $name,
        ]);
    }
}
