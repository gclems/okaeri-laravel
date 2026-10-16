<?php

use App\Domains\Domo\Actions\UpdateDomoInputs;
use App\Domains\Domo\Events\DomoInputsUpdated;
use App\Domains\Domo\Events\DomoInputUpdated;
use App\Models\DomoInput;
use Illuminate\Support\Facades\Event;

/**
 * @return array<string, mixed>
 */
function haInputState(string $entityId, string $state): array
{
    return [
        'entity_id' => $entityId,
        'state' => $state,
        'attributes' => ['friendly_name' => $entityId],
        'last_updated' => '2026-10-08T10:00:00+00:00',
    ];
}

beforeEach(function () {
    Event::fake([DomoInputUpdated::class, DomoInputsUpdated::class]);
});

it('stores only input helpers on a full sync', function () {
    app(UpdateDomoInputs::class)->execute([
        haInputState('input_text.natural_light_areas', 'salon,cuisine'),
        haInputState('input_boolean.guest_mode', 'off'),
        haInputState('light.salon', 'on'),
        haInputState('sun.sun', 'above_horizon'),
    ]);

    expect(DomoInput::pluck('value', 'ha_entity_id')->all())->toBe([
        'input_text.natural_light_areas' => 'salon,cuisine',
        'input_boolean.guest_mode' => 'off',
    ]);

    Event::assertDispatched(DomoInputsUpdated::class);
    Event::assertNotDispatched(DomoInputUpdated::class);
});

it('removes inputs that no longer exist on a full sync', function () {
    DomoInput::factory()->create(['ha_entity_id' => 'input_text.removed']);

    app(UpdateDomoInputs::class)->execute([
        haInputState('input_text.natural_light_areas', 'salon'),
        haInputState('light.salon', 'on'),
    ]);

    expect(DomoInput::pluck('ha_entity_id')->all())->toBe(['input_text.natural_light_areas']);
});

it('updates a single input on state change and broadcasts it', function () {
    DomoInput::factory()->create([
        'ha_entity_id' => 'input_text.natural_light_areas',
        'value' => 'salon',
    ]);

    app(UpdateDomoInputs::class)->execute([
        haInputState('input_text.natural_light_areas', 'salon,bureau'),
    ]);

    expect(DomoInput::sole()->value)->toBe('salon,bureau');

    Event::assertDispatched(
        DomoInputUpdated::class,
        fn (DomoInputUpdated $event) => $event->input->value === 'salon,bureau',
    );
});

it('ignores a state change of a non input entity', function () {
    DomoInput::factory()->create();

    app(UpdateDomoInputs::class)->execute([
        haInputState('light.salon', 'on'),
    ]);

    expect(DomoInput::count())->toBe(1);

    Event::assertNothingDispatched();
});
