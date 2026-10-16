<?php

use App\Models\DomoRoom;

it('requires rooms and a target state', function () {
    $this->postJson(route('lighting.toggleRooms'))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['rooms_ids', 'target_state']);
});

it('rejects unknown rooms and invalid target states', function () {
    $room = DomoRoom::forceCreate(['ha_id' => 'salon', 'name' => 'Salon']);

    $this->postJson(route('lighting.toggleRooms'), [
        'rooms_ids' => [$room->id, $room->id + 1],
        'target_state' => 'dim',
    ])->assertUnprocessable()->assertJsonValidationErrors(['rooms_ids.1', 'target_state']);
});
