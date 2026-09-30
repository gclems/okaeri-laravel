<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Events\DomoRoomsUpdated;
use App\Domains\HomeAssistant\DTO\HomeAssistantArea as DTOHomeAssistantArea;
use App\Models\DomoRoom;

final class SyncDomoRooms
{
    /**
     * @param  array<array-key, DTOHomeAssistantArea>  $haAreas
     */
    public function execute(array $haAreas): void
    {
        $collection = collect($haAreas);
        DomoRoom::upsert(
            $collection->map(fn (DTOHomeAssistantArea $area) => [
                'ha_id' => $area->id,
                'name' => $area->name,
                'ha_temperature_entity_id' => $area->temperatureEntityId,
                'ha_humidity_entity_id' => $area->humidityEntityId,
                'raw' => json_encode($area),
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray(),
            ['ha_id'],
            ['name', 'raw', 'ha_id', 'ha_temperature_entity_id', 'ha_humidity_entity_id']
        );

        DomoRoom::whereNotIn('ha_id', $collection->pluck('id'))->delete();

        DomoRoomsUpdated::dispatch();
    }
}
