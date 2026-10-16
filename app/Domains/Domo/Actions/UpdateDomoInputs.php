<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\Events\DomoInputsUpdated;
use App\Domains\Domo\Events\DomoInputUpdated;
use App\Models\DomoInput;
use Carbon\Carbon;

final class UpdateDomoInputs
{
    /**
     * @param  array<mixed>  $haEntityStates
     */
    public function execute(array $haEntityStates): void
    {
        // A state_changed event always carries a single state, whereas the
        // initial get_states carries all of them.
        $isFullSync = count($haEntityStates) > 1;

        $collection = collect($haEntityStates)
            ->filter(fn (mixed $item) => is_array($item) && str_starts_with($item['entity_id'] ?? '', 'input_'));

        if ($isFullSync) {
            DomoInput::query()
                ->whereNotIn('ha_entity_id', $collection->pluck('entity_id'))
                ->delete();
        }

        if ($collection->isEmpty()) {
            return;
        }

        DomoInput::upsert(
            $collection->map(fn (array $item) => [
                'ha_entity_id' => $item['entity_id'],
                'value' => $item['state'],
                'attributes' => json_encode($item['attributes']),
                'raw' => json_encode($item),
                'created_at' => now(),
                'updated_at' => Carbon::parse($item['last_updated']),
            ])->values()->toArray(),
            ['ha_entity_id'],
            ['value', 'attributes', 'raw', 'updated_at']
        );

        if ($isFullSync) {
            DomoInputsUpdated::dispatch();

            return;
        }

        $input = DomoInput::where('ha_entity_id', $collection->first()['entity_id'])->first();
        if ($input) {
            DomoInputUpdated::dispatch($input);
        }
    }
}
