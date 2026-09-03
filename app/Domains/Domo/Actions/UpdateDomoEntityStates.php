<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Events\DomoEntityStatesUpdated;
use App\Domains\Domo\Events\DomoEntityStateUpdated;
use App\Models\DomoEntityState;
use Carbon\Carbon;

final class UpdateDomoEntityStates
{
    public function execute(array $haEntityStates): void
    {
        $collection = collect($haEntityStates);

        DomoEntityState::upsert(
            $collection->map(fn (array $item) => [
                'ha_entity_id' => $item['entity_id'],
                'value' => $item['state'],
                'attributes' => json_encode($item['attributes']),
                'raw' => json_encode($item),
                'created_at' => now(),
                'updated_at' => Carbon::parse($item['last_updated']),
            ])->toArray(),
            ['ha_entity_id'],
            ['value', 'attributes', 'raw', 'updated_at']
        );

        if ($collection->count() > 1) {
            DomoEntityStatesUpdated::dispatch();
        } else {
            $state = DomoEntityState::where('ha_entity_id', $haEntityStates[0]['entity_id'])->first();
            if ($state) {
                DomoEntityStateUpdated::dispatch($state);
            }
        }
    }
}