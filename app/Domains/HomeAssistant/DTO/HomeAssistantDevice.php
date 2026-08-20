<?php

namespace App\Domains\HomeAssistant\DTO;

final class HomeAssistantDevice
{
    public function __construct(
        public readonly string $id,
        public readonly ?string $areaId,
        public readonly string $name,
        public readonly bool $isVirtual,
        public readonly ?string $manufacturer,
        public readonly ?string $disabledBy,
        public readonly ?string $model,
        public readonly ?string $swVersion,
        public readonly ?string $hwVersion,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'],
            areaId: $data['area_id'] ?? null,
            name: $data['name_by_user'] ?? $data['name'] ?? 'unknown',
            isVirtual: $data['entry_type'] === 'service',
            manufacturer: $data['manufacturer'] ?? null,
            disabledBy: $data['disabled_by'] ?? null,
            model: $data['model'] ?? null,
            swVersion: $data['sw_version'] ?? null,
            hwVersion: $data['hw_version'] ?? null,
        );
    }
}
