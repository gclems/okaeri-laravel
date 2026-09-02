<?php

namespace App\Domains\Domo\Models;

use App\Models\DomoDevice;
use App\Models\DomoEntity;
use App\Models\DomoEntityState;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

final class EntityWithState
{
    public function __construct(
        public readonly DomoEntity $entity,
        public readonly DomoEntityState $state,
    ) {}

    public function belongsTo(DomoDevice $device): bool
    {
        return $this->entity->ha_device_id === $device->ha_id;
    }

    /**
     * @param  EloquentCollection<int, DomoEntity>  $entities
     * @param  EloquentCollection<int, DomoEntityState>  $states
     * @return Collection<int, self>
     */
    public static function pair(EloquentCollection $entities, EloquentCollection $states): Collection
    {
        return $entities
            ->map(fn (DomoEntity $entity) => [
                $entity,
                $states->firstWhere('ha_entity_id',
                    $entity->ha_id),
            ])
            ->filter(fn (array $pair) => $pair[1] !== null)
            ->map(fn (array $pair) => new self(...$pair));
    }
}
