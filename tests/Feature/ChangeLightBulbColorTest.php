<?php

use App\Models\DomoEntity;
use App\Models\DomoEntityState;

/**
 * @param  array<string, mixed>  $attributes
 */
function createEntityWithState(string $domain, array $attributes): DomoEntity
{
    $entity = DomoEntity::factory()->domain($domain)->create();

    DomoEntityState::forceCreate([
        'ha_entity_id' => $entity->ha_id,
        'value' => 'on',
        'attributes' => $attributes,
    ]);

    return $entity;
}

it('rejects entities that do not support RGB colors', function (string $domain, array $attributes) {
    $entity = createEntityWithState($domain, $attributes);

    $this->postJson(route('lighting.changeLightBulbColor'), [
        'ha_entity_id' => $entity->ha_id,
        'red' => 255,
        'green' => 128,
        'blue' => 0,
    ])->assertUnprocessable()->assertJsonValidationErrors('ha_entity_id');
})->with([
    'white only light' => ['light', ['supported_color_modes' => ['color_temp']]],
    'light without color modes' => ['light', []],
    'non light entity' => ['switch', ['supported_color_modes' => ['xy']]],
]);

it('rejects color components outside of the 0-255 range', function () {
    $entity = createEntityWithState('light', ['supported_color_modes' => ['xy']]);

    $this->postJson(route('lighting.changeLightBulbColor'), [
        'ha_entity_id' => $entity->ha_id,
        'red' => 256,
        'green' => -1,
        'blue' => 0,
    ])->assertUnprocessable()->assertJsonValidationErrors(['red', 'green']);
});

it('requires a color or a brightness', function () {
    $entity = createEntityWithState('light', ['supported_color_modes' => ['xy']]);

    $this->postJson(route('lighting.changeLightBulbColor'), [
        'ha_entity_id' => $entity->ha_id,
    ])->assertUnprocessable()->assertJsonValidationErrors('red');
});

it('requires every color component when one is given', function () {
    $entity = createEntityWithState('light', ['supported_color_modes' => ['xy']]);

    $this->postJson(route('lighting.changeLightBulbColor'), [
        'ha_entity_id' => $entity->ha_id,
        'red' => 255,
        'brightness' => 128,
    ])->assertUnprocessable()->assertJsonValidationErrors(['green', 'blue']);
});

it('rejects a brightness outside of the 0-255 range', function (int $brightness) {
    $entity = createEntityWithState('light', ['supported_color_modes' => ['xy']]);

    $this->postJson(route('lighting.changeLightBulbColor'), [
        'ha_entity_id' => $entity->ha_id,
        'red' => 255,
        'green' => 128,
        'blue' => 0,
        'brightness' => $brightness,
    ])->assertUnprocessable()->assertJsonValidationErrors('brightness');
})->with([256, -1]);
