<?php

namespace App\Domains\HomeAssistant\DTO;

final class HomeAssistantEntityState
{
    /**
     * @param  array<string, mixed>|null  $attributes
     */
    public function __construct(
        public readonly string $id,
        public readonly ?string $state,
        public readonly ?array $attributes,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['entity_id'],
            state: $data['state'] ?? null,
            attributes: $data['attributes'] ?? null,
        );
    }
}
