<?php

namespace App\Domains\HomeAssistant\DTO;

final class HomeAssistantWeatherForecast
{
    public function __construct(
        public readonly string $datetime,
        public readonly ?string $condition,
        public readonly float $temperature,
        public readonly ?float $temperatureLow,
        public readonly ?int $humidity,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            datetime: $data['datetime'],
            condition: $data['condition'] ?? null,
            temperature: (float) $data['temperature'],
            temperatureLow: isset($data['templow']) ? (float) $data['templow'] : null,
            humidity: isset($data['humidity']) ? (int) $data['humidity'] : null,
        );
    }
}
