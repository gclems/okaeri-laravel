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

        $brightness = 0;
        if (isset($state->attributes['brightness'])) {
            $brightness = max(0, min(1, $state->attributes['brightness'] / 255));
        }

        $color = null;
        if (! empty($state->attributes['rgb_color'])) {
            $color = sprintf('rgb(%d, %d, %d)', ...$state->attributes['rgb_color']);
        } elseif (isset($state->attributes['brightness'])) {
            $from = [254, 206, 66];
            $brightnessApplied = array_map(fn ($value) => max(0, min(255, $value * $state->attributes['brightness'] / 255)), $from);
            $color = sprintf('rgb(%d, %d, %d)', ...$brightnessApplied);
        }

        return new LightState(
            id: $entity->id,
            isOn: $state->value === 'on',
            supportsColor: $this->supportsColor($entityAndState),
            brightness: $brightness,
            rgb: $color,
        );
    }

    private function supportsColor(EntityWithState $entityAndState): bool
    {
        $modes = $entityAndState->state->attributes['supported_color_modes'] ?? [];

        return ! empty(array_intersect($modes, self::SUPPORTED_COLOR_MODES));
    }
}