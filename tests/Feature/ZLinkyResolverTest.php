<?php

use App\Domains\Domo\Models\Devices\ElectricityMeter;
use App\Domains\Domo\Resolvers\Devices\GeneralDeviceResolver;
use App\Domains\Domo\Tracers\GeneralEntityTracer;
use App\Domains\Domo\Tracers\ZLinkyEnergyIndexTracer;
use App\Models\DomoDevice;
use App\Models\DomoEntity;
use App\Models\DomoEntityState;

/**
 * @param  array<string, string>  $attributes
 */
function zLinkyEntity(DomoDevice $device, string $haId, string $value, array $attributes = []): DomoEntity
{
    $entity = DomoEntity::factory()->create([
        'ha_id' => $haId,
        'ha_device_id' => $device->ha_id,
        'platform' => 'zha',
    ]);

    DomoEntityState::forceCreate([
        'ha_entity_id' => $haId,
        'value' => $value,
        'attributes' => $attributes,
    ]);

    return $entity;
}

beforeEach(function () {
    $this->device = DomoDevice::factory()->create([
        'manufacturer' => 'LiXee',
        'model' => 'ZLinky_TIC',
    ]);

    zLinkyEntity($this->device, 'button.lixee_zlinky_tic_identifier', 'unknown');
    zLinkyEntity($this->device, 'sensor.lixee_zlinky_tic_consommation', '8167.493', ['unit_of_measurement' => 'kWh']);

    foreach (range(1, 6) as $tier) {
        zLinkyEntity($this->device, "sensor.lixee_zlinky_tic_consommation_tranche_{$tier}", (string) $tier, ['unit_of_measurement' => 'kWh']);
    }

    zLinkyEntity($this->device, 'sensor.lixee_zlinky_tic_puissance', '250.0', ['unit_of_measurement' => 'W']);
    zLinkyEntity($this->device, 'sensor.lixee_zlinky_tic_puissance_phase_b', '0.0', ['unit_of_measurement' => 'W']);
    zLinkyEntity($this->device, 'sensor.lixee_zlinky_tic_puissance_apparente', '1860.0', ['unit_of_measurement' => 'VA']);
    zLinkyEntity($this->device, 'sensor.lixee_zlinky_tic_tension', 'unavailable', ['unit_of_measurement' => 'V']);
});

it('resolves the ZLinky device into an electricity meter', function () {
    $meter = app(GeneralDeviceResolver::class)->resolve($this->device);

    expect($meter)->toBeInstanceOf(ElectricityMeter::class)
        ->and($meter->consumption->value)->toBe(8167.493)
        ->and($meter->consumption->unit)->toBe('kWh')
        ->and(array_map(fn ($tier) => $tier->value, $meter->consumptionTiers))->toBe([1.0, 2.0, 3.0, 4.0, 5.0, 6.0])
        ->and($meter->activePower->value)->toBe(250.0)
        ->and($meter->activePowerPhaseB->value)->toBe(0.0)
        ->and($meter->apparentPower->unit)->toBe('VA')
        ->and($meter->injectedEnergy)->toBeNull();
});

it('resolves a non numeric state to a null value', function () {
    $meter = app(GeneralDeviceResolver::class)->resolve($this->device);

    expect($meter->voltage->value)->toBeNull()
        ->and($meter->voltage->unit)->toBe('V');
});

it('only traces the energy indexes', function () {
    $tracer = app(GeneralEntityTracer::class);

    expect($tracer->findTracer(DomoEntity::firstWhere('ha_id', 'sensor.lixee_zlinky_tic_consommation_tranche_1')))
        ->toBeInstanceOf(ZLinkyEnergyIndexTracer::class)
        ->and($tracer->findTracer(DomoEntity::firstWhere('ha_id', 'sensor.lixee_zlinky_tic_puissance_apparente')))
        ->toBeNull();
});
