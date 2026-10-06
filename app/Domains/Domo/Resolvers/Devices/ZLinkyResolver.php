<?php

namespace App\Domains\Domo\Resolvers\Devices;

use App\Domains\Domo\Models\Devices\ElectricityMeter;
use App\Domains\Domo\Models\Entities\ElectricMeasurement;
use App\Domains\Domo\Resolvers\Entities\ZLinkyMeasurementResolver;
use App\Models\DomoDevice;
use App\Models\DomoEntity;

final class ZLinkyResolver implements DeviceResolver
{
    /**
     * Cumulative energy indexes (kWh), slowly increasing.
     *
     * @var list<string>
     */
    public const array ENERGY_INDEX_SUFFIXES = [
        'consommation',
        ...self::CONSUMPTION_TIER_SUFFIXES,
        'cumul_recu',
    ];

    /**
     * Ordered from tier 1 to tier 6.
     *
     * @var list<string>
     */
    private const array CONSUMPTION_TIER_SUFFIXES = [
        'consommation_tranche_1',
        'consommation_tranche_2',
        'consommation_tranche_3',
        'consommation_tranche_4',
        'consommation_tranche_5',
        'consommation_tranche_6',
    ];

    /**
     * Instantaneous measurements (W, VA, A, V).
     *
     * @var list<string>
     */
    private const array INSTANTANEOUS_SUFFIXES = [
        'puissance',
        'puissance_phase_b',
        'puissance_totale',
        'puissance_apparente',
        'courant',
        'courant_phase_b',
        'courant_phase_c',
        'tension',
        'tension_phase_b',
        'tension_phase_c',
    ];

    public function supports(DomoDevice $device): bool
    {
        return $device->manufacturer === 'LiXee'
            && $device->model === 'ZLinky_TIC';
    }

    public function resolve(DomoDevice $device): ElectricityMeter
    {
        $measurements = $this->resolveMeasurements($device);

        return new ElectricityMeter(
            id: $device->id,
            name: $device->name,
            isActive: $device->is_active,
            roomId: $device->room?->id,
            consumption: $measurements['consommation'] ?? null,
            consumptionTiers: array_values(array_filter(
                array_map(fn (string $suffix) => $measurements[$suffix] ?? null, self::CONSUMPTION_TIER_SUFFIXES),
            )),
            injectedEnergy: $measurements['cumul_recu'] ?? null,
            activePower: $measurements['puissance'] ?? null,
            activePowerPhaseB: $measurements['puissance_phase_b'] ?? null,
            totalActivePower: $measurements['puissance_totale'] ?? null,
            apparentPower: $measurements['puissance_apparente'] ?? null,
            current: $measurements['courant'] ?? null,
            currentPhaseB: $measurements['courant_phase_b'] ?? null,
            currentPhaseC: $measurements['courant_phase_c'] ?? null,
            voltage: $measurements['tension'] ?? null,
            voltagePhaseB: $measurements['tension_phase_b'] ?? null,
            voltagePhaseC: $measurements['tension_phase_c'] ?? null,
        );
    }

    /**
     * @return array<string, ElectricMeasurement>
     */
    private function resolveMeasurements(DomoDevice $device): array
    {
        $resolvers = collect([...self::ENERGY_INDEX_SUFFIXES, ...self::INSTANTANEOUS_SUFFIXES])
            ->mapWithKeys(fn (string $suffix) => [$suffix => new ZLinkyMeasurementResolver($suffix)]);

        $measurements = [];

        $device->entities->each(function (DomoEntity $entity) use ($device, $resolvers, &$measurements) {
            $resolvers->each(function (ZLinkyMeasurementResolver $resolver, string $suffix) use ($entity, $device, &$measurements) {
                if (! isset($measurements[$suffix]) && $resolver->supports($entity, $device)) {
                    $measurements[$suffix] = $resolver->resolve($entity, $device);
                }
            });
        });

        return $measurements;
    }
}
