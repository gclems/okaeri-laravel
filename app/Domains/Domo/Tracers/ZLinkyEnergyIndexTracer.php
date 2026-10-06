<?php

namespace App\Domains\Domo\Tracers;

use App\Domains\Domo\Resolvers\Devices\ZLinkyResolver;
use App\Domains\Domo\Resolvers\Entities\ZLinkyMeasurementResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;
use Illuminate\Support\Arr;

/**
 * Only the cumulative energy indexes are traced: the instantaneous measurements
 * (power, current, voltage) are reported too often to be journaled.
 */
final class ZLinkyEnergyIndexTracer implements EntityTracer
{
    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        return collect(ZLinkyResolver::ENERGY_INDEX_SUFFIXES)
            ->contains(fn (string $suffix) => (new ZLinkyMeasurementResolver($suffix))->supports($entity, $device));
    }

    public function tracedAttributes(array $attributes): array
    {
        return Arr::only($attributes, ['unit_of_measurement']);
    }
}
