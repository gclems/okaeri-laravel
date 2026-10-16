<?php

namespace App\Domains\Domo\Actions;

use App\Domains\HomeAssistant\HAWSClient;

final class ChangeLightBulbColorAction
{
    public function __construct(
        private readonly HAWSClient $hawsClient,
    ) {}

    /**
     * Goes through the light_set_color script, which also disables Natural Light
     * for the bulb's room so the setting is not overwritten.
     *
     * @param  array{0: int, 1: int, 2: int}|null  $rgb  null keeps the current color
     * @param  int|null  $brightness  0-255, null keeps the current brightness
     */
    public function execute(string $entity_ha_id, ?array $rgb = null, ?int $brightness = null): void
    {
        $data = [
            'entity' => $entity_ha_id,
        ];

        if ($rgb !== null) {
            $data['color'] = $rgb;
        }

        if ($brightness !== null && $brightness > 0) {
            $data['brightness_pct'] = max(1, (int) round($brightness * 100 / 255));
        }

        $this->hawsClient->callService('script', 'light_set_color', $data);
    }
}
