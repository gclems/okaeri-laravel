<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;
use App\Models\DomoRoom;

final class DeleteHomeAssistantAreaAction
{
    public function __construct(
        private HAWSClient $hawsClient
    ) {}

    public function execute(DomoRoom $room): void
    {
        $this->hawsClient->requestOnce([
            'type' => 'config/area_registry/delete',
            'area_id' => $room->ha_id,
        ]);
    }
}
