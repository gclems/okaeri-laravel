<?php

namespace App\Domains\HomeAssistant\DTO;

final class HomeAssistantEntity
{
    public function __construct(
        public readonly string $id,
        public readonly ?string $areaId,
        public readonly ?string $deviceId,
        public readonly string $name,
        public readonly ?string $platform,
        public readonly ?string $disabledBy,
        public readonly ?string $hiddenBy,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['entity_id'],
            areaId: $data['area_id'] ?? null,
            deviceId: $data['device_id'] ?? null,
            name: $data['name'] ?? $data['original_name'] ?? $data['entity_id'] ?? '',
            platform: $data['platform'] ?? null,
            disabledBy: $data['disabled_by'] ?? null,
            hiddenBy: $data['hidden_by'] ?? null,
        );
    }
}
