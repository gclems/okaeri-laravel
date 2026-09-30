<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Events\DomoEntitiesUpdated;
use App\Domains\HomeAssistant\DTO\HomeAssistantEntity;
use App\Models\DomoEntity;

final class SyncDomoEntities
{
    /**
     * @param  array<array-key, HomeAssistantEntity>  $haEntities
     */
    public function execute(array $haEntities): void
    {
        $kept = collect($haEntities)
            ->where(fn (HomeAssistantEntity $entity) => $entity->deviceId !== null
                && trim($entity->name) !== ''
                && $entity->disabledBy === null
            );

        DomoEntity::upsert(
            $kept
                ->map(fn (HomeAssistantEntity $entity) => [
                    'ha_id' => $entity->id,
                    'name' => $entity->name,
                    'ha_device_id' => $entity->deviceId,
                    'platform' => $entity->platform,
                    'raw' => json_encode($entity),
                    'created_at' => now(),
                    'updated_at' => now(),
                ])->toArray(),
            ['ha_id'],
            ['name', 'raw', 'ha_device_id', 'platform', 'ha_id']);

        DomoEntity::whereNotIn('ha_id', $kept->pluck('id'))->delete();

        DomoEntitiesUpdated::dispatch();
    }
}
