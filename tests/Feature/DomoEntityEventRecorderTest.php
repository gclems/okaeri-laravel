<?php

use App\Domains\Domo\Actions\UpdateDomoEntityStates;
use App\Domains\Domo\Events\DomoEntityEventsUpdated;
use App\Domains\Domo\Events\DomoEntityStatesUpdated;
use App\Domains\Domo\Events\DomoEntityStateUpdated;
use App\Models\DomoEntity;
use App\Models\DomoEntityEvent;
use Illuminate\Support\Facades\Event;

/**
 * @param  array<string, mixed>  $attributes
 * @return array<string, mixed>
 */
function haState(DomoEntity $entity, string $value, array $attributes = []): array
{
    return [
        'entity_id' => $entity->ha_id,
        'state' => $value,
        'attributes' => $attributes,
        'last_updated' => now()->toIso8601String(),
    ];
}

beforeEach(function () {
    Event::fake([DomoEntityEventsUpdated::class, DomoEntityStateUpdated::class, DomoEntityStatesUpdated::class]);

    $this->updateStates = fn (array ...$states) => app(UpdateDomoEntityStates::class)->execute($states);
    $this->light = DomoEntity::factory()->domain('light')->create();
});

it('records a light turning on with its brightness', function () {
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 255]));

    $event = DomoEntityEvent::sole();
    expect($event->domo_entity_id)->toBe($this->light->id)
        ->and($event->value)->toBe('on')
        ->and($event->attributes)->toBe(['brightness' => 255]);

    Event::assertDispatchedTimes(DomoEntityEventsUpdated::class, 1);
});

it('coalesces a brightness ramp into a single event with the final state', function () {
    foreach ([50, 100, 150, 200] as $brightness) {
        ($this->updateStates)(haState($this->light, 'on', ['brightness' => $brightness]));
        $this->travel(1)->seconds();
    }

    expect(DomoEntityEvent::sole()->attributes)->toBe(['brightness' => 200]);
});

it('drops a transition that goes back to the previous state', function () {
    ($this->updateStates)(haState($this->light, 'off'));
    $this->travel(1)->minutes();

    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 255]));
    $this->travel(1)->seconds();
    ($this->updateStates)(haState($this->light, 'off'));

    expect(DomoEntityEvent::sole()->value)->toBe('off');
});

it('records separate events outside of the coalescing window', function () {
    ($this->updateStates)(haState($this->light, 'on'));
    $this->travel(1)->minutes();
    ($this->updateStates)(haState($this->light, 'off'));

    expect(DomoEntityEvent::pluck('value')->all())->toBe(['on', 'off']);
});

it('ignores changes of untracked attributes', function () {
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 255, 'linkquality' => 10]));
    $this->travel(1)->minutes();
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 255, 'linkquality' => 80]));

    expect(DomoEntityEvent::sole()->attributes)->toBe(['brightness' => 255]);
    Event::assertDispatchedTimes(DomoEntityEventsUpdated::class, 1);
});

it('records a change of a tracked attribute with the same value', function () {
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 255]));
    $this->travel(1)->minutes();
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 100]));

    expect(DomoEntityEvent::count())->toBe(2);
});

it('does not trace entities without tracer', function () {
    $contact = DomoEntity::factory()->domain('binary_sensor')->create();

    ($this->updateStates)(haState($contact, 'on', ['device_class' => 'door']));

    expect(DomoEntityEvent::count())->toBe(0);
    Event::assertNotDispatched(DomoEntityEventsUpdated::class);
});

it('only traces the value of entities whose tracer defines no attribute', function () {
    $rainChance = DomoEntity::factory()->create(['ha_id' => 'sensor.paris_rain_chance']);

    ($this->updateStates)(haState($rainChance, '20', ['unit_of_measurement' => '%']));

    $event = DomoEntityEvent::sole();
    expect($event->value)->toBe('20')
        ->and($event->attributes)->toBeNull();
});

it('broadcasts once for a batch of state updates', function () {
    $sensor = DomoEntity::factory()->create(['ha_id' => 'sensor.paris_temperature']);

    ($this->updateStates)(
        haState($this->light, 'on'),
        haState($sensor, '19.5', ['unit_of_measurement' => '°C']),
    );

    expect(DomoEntityEvent::count())->toBe(2);
    Event::assertDispatchedTimes(DomoEntityEventsUpdated::class, 1);
});

it('prunes events older than the retention period', function () {
    DomoEntityEvent::factory()->for($this->light, 'entity')->create([
        'occurred_at' => now()->subDays(DomoEntityEvent::RETENTION_DAYS + 1),
    ]);
    $recent = DomoEntityEvent::factory()->for($this->light, 'entity')->create();

    $this->artisan('model:prune', ['--model' => DomoEntityEvent::class]);

    expect(DomoEntityEvent::pluck('id')->all())->toBe([$recent->id]);
});

it('lists the latest events with their entity', function () {
    DomoEntityEvent::factory()->for($this->light, 'entity')->create();

    $this->getJson(route('domo-entity-events.list'))
        ->assertOk()
        ->assertJsonPath('0.entity.id', $this->light->id);
});

it('traces the attributes defined by the tracer mirroring the entity resolver', function () {
    $temperature = DomoEntity::factory()->create(['ha_id' => 'sensor.paris_temperature']);

    ($this->updateStates)(haState($temperature, '19.5', ['unit_of_measurement' => '°C', 'attribution' => 'Météo-France']));

    expect(DomoEntityEvent::sole()->attributes)->toBe(['unit_of_measurement' => '°C']);
});

it('records every traced key as changed on the first event', function () {
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 255]));

    expect(DomoEntityEvent::sole()->changes)->toBe(['value', 'brightness']);
});

it('records only the keys that changed since the previous event', function () {
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 255]));
    $this->travel(1)->minutes();
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 100]));
    $this->travel(1)->minutes();
    ($this->updateStates)(haState($this->light, 'off', ['brightness' => 100]));

    expect(DomoEntityEvent::pluck('changes')->all())->toBe([
        ['value', 'brightness'],
        ['brightness'],
        ['value'],
    ]);
});

it('records a removed attribute as changed', function () {
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 255]));
    $this->travel(1)->minutes();
    ($this->updateStates)(haState($this->light, 'off'));

    expect(DomoEntityEvent::latest('id')->first()->changes)->toBe(['value', 'brightness']);
});

it('records the changes of a coalesced burst against the state before it', function () {
    ($this->updateStates)(haState($this->light, 'off'));
    $this->travel(1)->minutes();

    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 50]));
    $this->travel(1)->seconds();
    ($this->updateStates)(haState($this->light, 'on', ['brightness' => 200]));

    expect(DomoEntityEvent::latest('id')->first()->changes)->toBe(['value', 'brightness']);
});
