<?php

namespace App\Domains\HomeAssistant\Messages;

final class HAWSMessageFactory
{
    public function create(array $payload): HAWSMessage
    {
        return match ($payload['type'] ?? null) {
            'auth_required' => new HAAuthRequiredWSMessage($payload['ha_version'] ?? ''),
            'auth_ok' => new HAAuthOKWSMessage($payload['ha_version'] ?? ''),
            'auth_invalid' => new HAAuthInvalidWSMessage($payload['message'] ?? ''),
            'event' => new HAEventWSMessage(
                $payload['id'],
                $payload['event']['event_type'] ?? '',
                $payload['event']['data'] ?? [],
            ),
            'result' => new HAResultWSMessage(
                $payload['id'],
                $payload['success'] ?? false,
                $payload['result'] ?? null,
                $payload['error'] ?? null,
            ),
            'pong' => new HAPongWSMessage(),
            default => new HAUnknownWSMessage(
                $payload['type'] ?? 'unknown',
                $payload['ha_version'] ?? '',
                $payload,
            ),
        };
    }
}
