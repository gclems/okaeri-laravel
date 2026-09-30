<?php

namespace App\Domains\Domo\Services;

use App\Domains\Domo\Tracers\GeneralEntityTracer;
use App\Models\DomoEntity;
use App\Models\DomoEntityEvent;
use App\Models\DomoEntityState;

/**
 * Records entity state changes into the domo_entity_events journal. The state value is
 * always traced, attributes are traced according to the entity tracer. Entities without
 * tracer are not traced. Each event
 * keeps the full traced state and the keys that changed since the previous event.
 *
 * Successive changes of the same entity happening within a short window are
 * coalesced into a single event holding the final state (e.g. a brightness ramp).
 */
final class DomoEntityEventRecorder
{
    public const int COALESCING_WINDOW_SECONDS = 2;

    public function __construct(
        private GeneralEntityTracer $tracer
    ) {}

    /**
     * @return bool Whether the journal has been modified.
     */
    public function record(DomoEntity $entity, DomoEntityState $state): bool
    {
        $entityTracer = $this->tracer->findTracer($entity);

        if ($entityTracer === null) {
            return false;
        }

        $attributes = $entityTracer->tracedAttributes($state->attributes) ?: null;

        [$latest, $previous] = DomoEntityEvent::query()
            ->where('domo_entity_id', $entity->id)
            ->latest('occurred_at')
            ->latest('id')
            ->limit(2)
            ->get()
            ->pad(2, null)
            ->all();

        if ($latest === null) {
            $this->create($entity, null, $state->value, $attributes);

            return true;
        }

        $isWithinCoalescingWindow = $latest->occurred_at->diffInSeconds(now()) < self::COALESCING_WINDOW_SECONDS;

        if ($isWithinCoalescingWindow) {
            return $this->coalesce($latest, $previous, $state->value, $attributes);
        }

        if ($this->isSameState($latest, $state->value, $attributes)) {
            return false;
        }

        $this->create($entity, $latest, $state->value, $attributes);

        return true;
    }

    /**
     * Replaces the latest event state with the new one. If the entity went back to the
     * state it had before the latest event, the latest event is dropped as it was only a transition.
     *
     * @param  array<string, mixed>|null  $attributes
     */
    private function coalesce(DomoEntityEvent $latest, ?DomoEntityEvent $previous, string $value, ?array $attributes): bool
    {
        if ($this->isSameState($latest, $value, $attributes)) {
            return false;
        }

        if ($previous !== null && $this->isSameState($previous, $value, $attributes)) {
            $latest->delete();

            return true;
        }

        $latest->update([
            'value' => $value,
            'attributes' => $attributes,
            'changes' => $this->changedKeys($previous, $value, $attributes),
            'occurred_at' => now(),
        ]);

        return true;
    }

    /**
     * @param  array<string, mixed>|null  $attributes
     */
    private function isSameState(DomoEntityEvent $event, string $value, ?array $attributes): bool
    {
        return $event->value === $value && $event->attributes == $attributes;
    }

    /**
     * Keys ("value" and/or attribute names) that differ from the reference event.
     * Without reference, the whole state is considered as changed.
     *
     * @param  array<string, mixed>|null  $attributes
     * @return list<string>
     */
    private function changedKeys(?DomoEntityEvent $reference, string $value, ?array $attributes): array
    {
        $attributes ??= [];

        if ($reference === null) {
            return ['value', ...array_keys($attributes)];
        }

        $referenceAttributes = $reference->attributes ?? [];

        $changedAttributes = array_filter(
            array_unique([...array_keys($referenceAttributes), ...array_keys($attributes)]),
            fn (string $key) => ($referenceAttributes[$key] ?? null) != ($attributes[$key] ?? null),
        );

        return [
            ...($reference->value !== $value ? ['value'] : []),
            ...$changedAttributes,
        ];
    }

    /**
     * @param  array<string, mixed>|null  $attributes
     */
    private function create(DomoEntity $entity, ?DomoEntityEvent $latest, string $value, ?array $attributes): void
    {
        DomoEntityEvent::create([
            'domo_entity_id' => $entity->id,
            'value' => $value,
            'attributes' => $attributes,
            'changes' => $this->changedKeys($latest, $value, $attributes),
            'occurred_at' => now(),
        ]);
    }
}
