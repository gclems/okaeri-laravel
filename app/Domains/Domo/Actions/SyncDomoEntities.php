<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\DomoEventMode;
use App\Domains\Domo\Events\DomoEntitiesUpdated;
use App\Domains\HomeAssistant\DTO\HomeAssistantEntity;
use App\Models\DomoEntity;

final class SyncDomoEntities
{
    public function execute(array $haEntities): void
    {
        $kept = collect($haEntities)
            ->where(fn (HomeAssistantEntity $entity) => $entity->deviceId !== null
                && $entity->name !== null
                && trim($entity->name) !== ''
            );

        DomoEntity::upsert(
            $kept
                ->map(fn (HomeAssistantEntity $entity) => [
                    'ha_id' => $entity->id,
                    'name' => $entity->name ?? null,
                    'ha_device_id' => $entity->deviceId ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])->toArray(),
            ['ha_id'],
            ['name']);

        DomoEntity::whereNotIn('ha_id', $kept->pluck('id'))->delete();

        DomoEntitiesUpdated::dispatch(
            DomoEntity::all()->toArray(),
            DomoEventMode::REPLACE
        );
    }
}
