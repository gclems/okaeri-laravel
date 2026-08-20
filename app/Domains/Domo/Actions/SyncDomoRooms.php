<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\DomoEventMode;
use App\Domains\Domo\Events\DomoRoomsUpdated;
use App\Domains\HomeAssistant\DTO\HomeAssistantArea as DTOHomeAssistantArea;
use App\Models\DomoRoom;

final class SyncDomoRooms
{
    public function execute(array $haAreas): void
    {
        $collection = collect($haAreas);
        DomoRoom::upsert(
            $collection->map(fn (DTOHomeAssistantArea $area) => [
                'ha_id' => $area->id,
                'name' => $area->name,
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray(),
            ['ha_id'],
            ['name']
        );

        DomoRoom::whereNotIn('ha_id', $collection->pluck('id'))->delete();

        DomoRoomsUpdated::dispatch(
            DomoRoom::all()->toArray(),
            DomoEventMode::REPLACE
        );
    }
}
