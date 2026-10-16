<?php

namespace App\Domains\Domo\Services;

use App\Models\DomoEntity;

/**
 * Tells whether a light entity accepts an RGB color, based on the standard Home Assistant
 * `supported_color_modes` attribute, regardless of the light manufacturer.
 */
final class LightColorCapability
{
    /**
     * Color modes for which Home Assistant accepts (and converts) an `rgb_color`.
     */
    private const array RGB_COMPATIBLE_COLOR_MODES = ['xy', 'hs', 'rgb', 'rgbw', 'rgbww'];

    public function supportsRgbColor(DomoEntity $entity): bool
    {
        if ($entity->domain !== 'light' || $entity->state === null) {
            return false;
        }

        $modes = $entity->state->attributes['supported_color_modes'] ?? [];

        return ! empty(array_intersect($modes, self::RGB_COMPATIBLE_COLOR_MODES));
    }
}
