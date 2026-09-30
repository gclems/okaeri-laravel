<?php

use App\Domains\Domo\Actions\SyncDomoRooms;
use App\Domains\HomeAssistant\DTO\HomeAssistantArea;
use App\Models\DomoRoom;

it('stores the temperature and humidity entities assigned to an area', function () {
    app(SyncDomoRooms::class)->execute([
        HomeAssistantArea::fromArray([
            'area_id' => 'salon',
            'name' => 'Salon',
            'temperature_entity_id' => 'sensor.salon_temperature',
            'humidity_entity_id' => 'sensor.salon_humidity',
        ]),
        HomeAssistantArea::fromArray([
            'area_id' => 'cuisine',
            'name' => 'Cuisine',
        ]),
    ]);

    $salon = DomoRoom::where('ha_id', 'salon')->sole();
    expect($salon->ha_temperature_entity_id)->toBe('sensor.salon_temperature')
        ->and($salon->ha_humidity_entity_id)->toBe('sensor.salon_humidity');

    $cuisine = DomoRoom::where('ha_id', 'cuisine')->sole();
    expect($cuisine->ha_temperature_entity_id)->toBeNull()
        ->and($cuisine->ha_humidity_entity_id)->toBeNull();
});

it('updates the climate entities when they change in Home Assistant', function () {
    $action = app(SyncDomoRooms::class);

    $action->execute([HomeAssistantArea::fromArray([
        'area_id' => 'salon',
        'name' => 'Salon',
        'temperature_entity_id' => 'sensor.salon_temperature',
    ])]);

    $action->execute([HomeAssistantArea::fromArray([
        'area_id' => 'salon',
        'name' => 'Salon',
        'temperature_entity_id' => null,
        'humidity_entity_id' => 'sensor.salon_humidity',
    ])]);

    $salon = DomoRoom::where('ha_id', 'salon')->sole();
    expect($salon->ha_temperature_entity_id)->toBeNull()
        ->and($salon->ha_humidity_entity_id)->toBe('sensor.salon_humidity');
});
