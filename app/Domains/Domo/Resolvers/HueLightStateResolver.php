<?php

namespace App\Domains\Domo\Resolvers;

use App\Domains\Domo\Models\EntityWithState;
use App\Domains\Domo\Models\LightState;
use App\Models\DomoDevice;

final class HueLightStateResolver implements EntityResolver
{
    private const array SUPPORTED_COLOR_MODES = ['xy', 'hs', 'rgb', 'rgbw', 'rgbww'];

    public function supports(EntityWithState $entityAndState): bool
    {
        return $entityAndState->entity->domain === 'light';
    }

    public function resolve(EntityWithState $entityAndState, DomoDevice $device): LightState
    {
        $entity = $entityAndState->entity;
        $state = $entityAndState->state;

        $color = null;
        if (! empty($state->attributes['rgb_color'])) {
            $color = sprintf('rgb(%d, %d, %d)', ...$state->attributes['rgb_color']);
        }

        return new LightState(
            id: $entity->id,
            isOn: $state->state === 'on',
            supportsColor: $this->supportsColor($entityAndState),
            brightness: $state->attributes['brightness'] ?? null,
            rgb: $color,
        );
    }

    private function supportsColor(EntityWithState $entityAndState): bool
    {
        $modes = $entityAndState->state->attributes['supported_color_modes'] ?? [];

        return ! empty(array_intersect($modes, self::SUPPORTED_COLOR_MODES));
    }
}
