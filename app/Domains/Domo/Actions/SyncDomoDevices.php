<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Events\DomoDevicesUpdated;
use App\Domains\HomeAssistant\DTO\HomeAssistantDevice as DTOHomeAssistantDevice;
use App\Models\DomoDevice;

final class SyncDomoDevices
{
    public function execute(array $haDevices): void
    {
        $collection = collect($haDevices);
        DomoDevice::upsert(
            $collection->map(fn (DTOHomeAssistantDevice $device) => [
                'ha_area_id' => $device->areaId ?? null,
                'ha_id' => $device->id,
                'name' => $device->name,
                'manufacturer' => $device->manufacturer ?? null,
                'model' => $device->model ?? null,
                'is_active' => $device->disabledBy === null,
                'is_virtual' => $device->isVirtual,
                'raw' => json_encode($device),
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray(),
            ['ha_id'],
            [
                'name',
                'raw',
                'is_active',
                'is_virtual',
                'ha_area_id',
                'ha_id',
                'manufacturer',
                'model',
            ]);

        DomoDevice::whereNotIn('ha_id', $collection->pluck('id'))->delete();

        DomoDevicesUpdated::dispatch();
    }
}
