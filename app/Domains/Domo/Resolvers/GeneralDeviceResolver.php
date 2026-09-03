<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\Device;
use App\Models\DomoDevice;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

final class GeneralDeviceResolver implements DeviceResolver
{
    /** @var list<DeviceResolver> */
    private readonly array $resolvers;

    public function __construct(
        AquaraClimateSensorResolver $climateSensorResolver,
        HueLightBulbResolver $lightBulbResolver,
        Renault4Resolver $renault4Resolver,
    ) {
        $this->resolvers = [
            $climateSensorResolver,
            $lightBulbResolver,
            $renault4Resolver,
        ];
    }

    public function supports(DomoDevice $device, Collection $entitiesWithStates): bool
    {
        return $this->findResolver($device, $entitiesWithStates) !== null;
    }

    public function resolve(DomoDevice $device, Collection $entitiesWithStates, EloquentCollection $rooms): Device
    {
        $resolver = $this->findResolver($device, $entitiesWithStates);

        if ($resolver === null) {
            throw new \RuntimeException("No resolver found for device [{$device->id}]");
        }

        return $resolver->resolve($device, $entitiesWithStates, $rooms);
    }

    private function findResolver(DomoDevice $device, Collection $entitiesWithStates): ?DeviceResolver
    {
        return collect($this->resolvers)
            ->first(fn (DeviceResolver $resolver) => $resolver->supports($device, $entitiesWithStates));
    }
}
