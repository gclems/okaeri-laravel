<?php

namespace App\Domains\HomeAssistant\DTO;

final class HomeAssistantArea
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly ?string $temperatureEntityId,
        public readonly ?string $humidityEntityId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['area_id'],
            name: $data['name'],
            temperatureEntityId: $data['temperature_entity_id'] ?? null,
            humidityEntityId: $data['humidity_entity_id'] ?? null,
        );
    }
}
