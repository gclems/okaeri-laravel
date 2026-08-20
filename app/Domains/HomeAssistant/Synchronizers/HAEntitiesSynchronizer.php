<?php

namespace App\Domains\HomeAssistant\Synchronizers;

use App\Domains\HomeAssistant\DTO\HomeAssistantEntity;
use App\Domains\HomeAssistant\Events\HAWSEntitiesSynchronized;
use App\Domains\HomeAssistant\HAWSClient;

final class HAEntitiesSynchronizer
{
    public function __construct(
        private HAWSClient $client,
    ) {}

    public function sync(): void
    {
        $entities = $this->client->request([
            'type' => 'config/entity_registry/list',
        ]);

        if (! is_array($entities)) {
            throw new \RuntimeException('Home Assistant entity registry response is invalid');
        }

        HAWSEntitiesSynchronized::dispatch(array_map(
            fn (array $entity) => HomeAssistantEntity::fromArray($entity),
            $entities
        ));
    }
}
