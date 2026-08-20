<?php

namespace App\Domains\HomeAssistant\DTO;

final class HomeAssistantArea
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['area_id'],
            name: $data['name'],
        );
    }
}
