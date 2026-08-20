<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\DomoEventMode;
use App\Domains\Domo\Events\DomoEntityStatesUpdated;
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
                'created_at' => now(),
                'updated_at' => Carbon::parse($item['last_updated']),
            ])->toArray(),
            ['ha_entity_id'],
            ['value', 'attributes', 'updated_at']
        );

        DomoEntityStatesUpdated::dispatch(
            DomoEntityState::query()
                ->whereIn('ha_entity_id', $collection->pluck('entity_id'))
                ->get()->toArray(),
            DomoEventMode::MERGE
        );
    }
}
